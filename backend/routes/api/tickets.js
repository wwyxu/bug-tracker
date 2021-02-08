const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation
const validateTicketInput = require("../../validation/ticket");
const validateCommentInput = require("../../validation/comment");

// Load User Model
const User = require("../../models/User");
// Load Ticket Model
const Ticket = require("../../models/Ticket");
// Load Project Model
const Project = require("../../models/Project");

// @route   GET api/tickets
// @desc    Get tickets
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.find({ user: req.user.id })
      .sort({ date: -1 })
      .then((tickets) => res.json(tickets))
      .catch((err) =>
        res.status(404).json({ noticketsfound: "No tickets found" })
      );
  }
);

// @route   GET api/pastyeartickets
// @desc    Get tickets from past year
// @access  Private
router.get(
  "/pastyeartickets",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.find({
      $date: function () {
        return Date.now() - this._id.getTimestamp() < 24 * 60 * 60 * 1000;
      },
      user: req.user.id,
    })
      .sort({ date: -1 })
      .then((tickets) => res.json(tickets))
      .catch((err) =>
        res.status(404).json({ noticketsfound: "No tickets found" })
      );
  }
);

// @route   GET api/tickets
// @desc    Get tickets
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.find({ user: req.user.id })
      .sort({ date: -1 })
      .then((tickets) => res.json(tickets))
      .catch((err) =>
        res.status(404).json({ noticketsfound: "No tickets found" })
      );
  }
);

// @route   GET api/tickets/assignedtickets
// @desc    Get assigned tickets
// @access  Private
router.get(
  "/assignedtickets",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.find({ assigneduser: req.user.id })
      .sort({ date: -1 })
      .then((assignedtickets) => res.json(assignedtickets))
      .catch((err) =>
        res
          .status(404)
          .json({ noassignedticketsfound: "No assigned tickets found" })
      );
  }
);

// @route   GET api/tickets/pastyearassignedtickets
// @desc    Get assigned tickets from past year
// @access  Private
router.get(
  "/pastyearassignedtickets",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.find({
      $date: function () {
        return Date.now() - this._id.getTimestamp() < 24 * 60 * 60 * 1000;
      },
      assigneduser: req.user.id,
    })
      .sort({ date: -1 })
      .then((assignedtickets) => res.json(assignedtickets))
      .catch((err) =>
        res
          .status(404)
          .json({ noassignedticketsfound: "No assigned tickets found" })
      );
  }
);

// @route   GET api/tickets/:id
// @desc    Get ticket by id
// @access  Public
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.findById(req.params.id)
      .populate("project", ["_id", "assigned"])
      .then((ticket) => {
        Project.findById(ticket.project._id).then((project) => {
          if (
            project.assigned.filter(
              (assign) => assign.user.toString() === req.user.id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ usernotauthorized: "User is not apart of this group" });
          }
        });
        res.json(ticket);
      })
      .catch((err) =>
        res.status(404).json({ noticketfound: "No ticket found with that ID" })
      );
  }
);

// @route   POST api/tickets
// @desc    Create ticket
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTicketInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Project.findOne({ _id: req.body.project })
      .then((project) => {
        // If there is a assigned user, find the name and add to ticket and save
        if (req.body.assigneduser && req.body.assigneduser != "Assign To") {
          User.findOne({ _id: req.body.assigneduser }).then((profile) => {
            const newTicket = new Ticket({
              project: req.body.project,
              projectname: req.body.projectname,
              user: req.user.id,
              name: req.body.name,
              avatar: req.body.avatar,
              ticketname: req.body.ticketname,
              ticketdescription: req.body.ticketdescription,
              priority: req.body.priority,
              duedate: req.body.duedate,
              assignedname: profile.name,
              assigneduser: req.body.assigneduser,
            });

            newTicket.save().then((ticket) => {
              project.tickets.unshift(ticket);
              project.save();
              res.json(ticket);
            });
          });
        } else {
          const newTicket = new Ticket({
            project: req.body.project,
            projectname: req.body.projectname,
            user: req.user.id,
            name: req.body.name,
            avatar: req.body.avatar,
            ticketname: req.body.ticketname,
            ticketdescription: req.body.ticketdescription,
            priority: req.body.priority,
            duedate: req.body.duedate,
          });

          newTicket.save().then((ticket) => {
            project.tickets.unshift(ticket);
            project.save();
            res.json(ticket);
          });
        }
      })
      .catch((err) =>
        res.status(404).json({ projectnotfound: "Project Not Found" })
      );
  }
);

// @route   POST api/tickets/edit/:id:ticket_id
// @desc    Edit Ticket
// @access  Private
router.post(
  "/edit/:id/:ticket_id/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTicketInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // Get fields
    const ticketFields = {};

    // If there is an assigned user, find the user name and set to ticketFields. If not set to null
    if (req.body.assigneduser && req.body.assigneduser != "Assign To") {
      User.findOne({ _id: req.body.assigneduser }).then((profile) => {
        ticketFields.assignedname = profile.name;
        ticketFields.assigneduser = req.body.assigneduser;
      });
    } else {
      ticketFields.assignedname = null;
      ticketFields.assigneduser = null;
    }

    if (req.body.ticketname) ticketFields.ticketname = req.body.ticketname;
    if (req.body.ticketdescription)
      ticketFields.ticketdescription = req.body.ticketdescription;
    if (req.body.priority) ticketFields.priority = req.body.priority;
    if (req.body.complete) ticketFields.complete = req.body.complete;
    if (req.body.duedate) ticketFields.duedate = req.body.duedate;

    Ticket.findOne({ _id: req.params.ticket_id }).then((ticket) => {
      // Check to see if ticket exists
      if (ticket) {
        // Check if user matches project user
        if (ticket.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        // Update
        Ticket.findOneAndUpdate(
          { _id: req.params.ticket_id },
          { $set: ticketFields },
          { new: true }
        ).then((ticket) => res.json(ticket));
      } else {
        return res
          .status(404)
          .json({ ticketdoesnotexists: "Ticket does not exist" });
      }
    });
  }
);

// @route   DELETE api/tickets/tickets/:id/:ticket_id
// @desc    Delete ticket from project and ticket database
// @access  Private
router.delete(
  "/tickets/:id/:ticket_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.findOne({ _id: req.params.ticket_id }).then((ticket) => {
      ticket.remove();
    });

    Project.findById(req.params.id)
      .then((project) => {
        if (!project) {
          () => res.json({ success: true });
        }

        // Check to see if comment exists
        if (
          project.tickets.filter(
            (ticket) => ticket._id.toString() === req.params.ticket_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ ticketnotexists: "Ticket does not exist" });
        }

        // Get remove index
        const removeIndex = project.tickets
          .map((item) => item._id.toString())
          .indexOf(req.params.ticket_id);

        // Splice comment out of array
        project.tickets.splice(removeIndex, 1);

        project.save().then(() => res.json({ success: true }));
      })
      .catch((err) => res.json({ success: true }));
  }
);

// @route   POST api/tickets/comment/:id
// @desc    Add comment to ticket
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Ticket.findById(req.params.id)
      .then((ticket) => {
        const newComment = {
          comment: req.body.comment,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        // Add to comments array
        ticket.comments.unshift(newComment);

        // Save
        ticket.save().then((ticket) => res.json(ticket));
      })
      .catch((err) =>
        res.status(404).json({ ticketnotfound: "No ticket found" })
      );
  }
);

// @route   DELETE api/tickets/comment/:id/:comment_id
// @desc    Remove comment from ticket
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Ticket.findById(req.params.id)
      .then((ticket) => {
        // Check to see if comment exists
        if (
          ticket.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = ticket.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        ticket.comments.splice(removeIndex, 1);

        ticket.save().then((ticket) => res.json(ticket));
      })
      .catch((err) =>
        res.status(404).json({ ticketnotfound: "Ticket not found" })
      );
  }
);

module.exports = router;
