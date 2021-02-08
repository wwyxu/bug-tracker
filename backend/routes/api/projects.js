const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Project Model
const Project = require("../../models/Project");
// Profile model
const Profile = require("../../models/Profile");
// Ticket model
const Ticket = require("../../models/Ticket");

// Validation
const validateProjectInput = require("../../validation/project");
const validateProjectUserInput = require("../../validation/projectuser");

// @route   GET api/project/testz
// @desc    Tests project route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Project Works" }));

// @route   GET api/projects
// @desc    Get projects
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.find({
      assigned: { $elemMatch: { user: req.user.id } },
    })
      .then((project) => res.json(project))
      .catch((err) =>
        res.status(404).json({ noprojectsfound: "No projects found" })
      );
  }
);

// @route   GET api/projects/:id
// @desc    Get project by id
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        if (
          project.assigned.filter(
            (user) => user.user.toString() === req.user.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ usernotauthorized: "User is not apart of this group" });
        }

        return res.json(project);
      })
      .catch((err) =>
        res
          .status(404)
          .json({ noprojectfound: "No project found with that ID" })
      );
  }
);

// @route   GET api/projects/:id
// @desc    Get project by id and pg
// @access  Private
router.get(
  "/:id/:pg",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .populate("tickets._id")
      .then((project) => {
        if (
          project.assigned.filter(
            (user) => user.user.toString() === req.user.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ usernotauthorized: "User is not apart of this group" });
        }

        const page = req.params.pg === "null" ? 1 : req.params.pg;

        // Number of tickets per page
        const limit = 15;

        // Index of tickets to be sliced and returned
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const maxPage =
          Math.ceil(project.tickets.length / limit) < 1
            ? 1
            : Math.ceil(project.tickets.length / limit);

        // List of Pagination Numbers
        let list = [];

        if (maxPage <= 10) {
          for (var i = 1; i <= maxPage; i++) {
            list.push(i);
          }
        } else {
          if (maxPage - page >= 4) {
            for (var i = maxPage - 10; i <= maxPage; i++) {
              list.push(i);
            }
          } else {
            for (var i = page - 5; i <= page + 4; i++) {
              list.push(i);
            }
          }
        }

        const results = {};
        results.totalPages = maxPage;
        results.currentPage = page;
        results.pages = list;
        results._id = project._id;
        results.user = project.user;
        results.name = project.name;
        results.assigned = project.assigned;
        results.projectname = project.projectname;
        results.projectdescription = project.projectdescription;
        results.duedate = project.duedate;
        results.date = project.date;
        results.complete = project.complete;
        results.tickets = project.tickets.slice(startIndex, endIndex);

        return res.json(results);
      })
      .catch((err) =>
        res
          .status(404)
          .json({ noprojectfound: "No project found with that ID" })
      );
  }
);

// @route   POST api/projects
// @desc    Create project and add project to owners profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newProject = new Project({
      name: req.user.name,
      user: req.user.id,
      projectname: req.body.projectname,
      projectdescription: req.body.projectdescription,
      duedate: req.body.duedate,
      assigned: [
        {
          user: req.user.id,
          name: req.body.name,
          role: "Project Creator",
        },
      ],
    });

    newProject.save().then((project) => {
      // Save Project to User Profile
      Profile.findOne({ user: req.user.id }).then((profile) => {
        const newProjects = {
          _id: project._id,
          project: project._id,
          name: req.body.projectname,
        };

        profile.projects.unshift(newProjects);

        profile.save();

        res.json(project);
      });
    });
  }
);

// @route   POST api/projects/edit-user/:project_id/:user_id/
// @desc    Edit User Role
// @access  Private
router.post(
  "/edit-user/:project_id/:user_id/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectUserInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const updatedUser = {
      user: req.body.user,
      name: req.body.name,
      avatar: req.body.avatar,
      role: req.body.role,
    };

    Project.findOne({ _id: req.params.project_id })
      .then((project) => {
        if (
          project.assigned.filter(
            (assign) => assign.user.toString() === req.body.user
          ).length === 0
        ) {
          return res.status(404).json({ usernotexists: "User does not exist" });
        }

        const removeIndex = project.assigned
          .map((item) => item.user.toString())
          .indexOf(req.body.user);

        // Splice user out of array
        project.assigned.splice(removeIndex, 1);

        // Add updated user
        project.assigned.unshift(updatedUser);

        project.save().then(() => res.json({ success: true }));
      })
      .catch((err) => res.status(404).json({ project: "Project not found" }));
  }
);

// @route   DELETE api/projects/removeuser/:id/:user_id
// @desc    Remove user from Project
// @access  Private
router.delete(
  "/removeuser/:id/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        // Check to see if user exists
        if (
          project.assigned.filter(
            (assign) => assign.user.toString() === req.params.user_id
          ).length === 0
        ) {
          return res.status(404).json({ usernotexists: "User does not exist" });
        }

        // Get remove index
        const removeIndex = project.assigned
          .map((item) => item.user.toString())
          .indexOf(req.params.user_id);

        // Splice user out of array
        project.assigned.splice(removeIndex, 1);

        project.save().then(
          Profile.findOne({ user: req.params.user_id })
            .then((profile) => {
              if (
                profile.projects.filter(
                  (project) => project.project.toString() === req.params.id
                ).length === 0
              ) {
                return res
                  .status(404)
                  .json({ projectnotexists: "Project does not exist" });
              }

              // Get remove index
              const removeIndex = profile.projects
                .map((item) => item.project.toString())
                .indexOf(req.params.id);

              // Splice project out of array
              profile.projects.splice(removeIndex, 1);

              profile.save().then(() => res.json({ success: true }));
            })
            .catch((err) =>
              res.status(404).json({ profile: "Profile not found" })
            )
        );
      })
      .catch((err) =>
        res.status(404).json({ projectnotfound: "Project not found" })
      );
  }
);

// @route   POST api/projects/edit-project/:id
// @desc    Edit Project
// @access  Private
router.post(
  "/edit-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // Get fields
    const projectFields = {};
    projectFields.user = req.user.id;
    if (req.body.projectname) projectFields.projectname = req.body.projectname;
    if (req.body.projectdescription)
      projectFields.projectdescription = req.body.projectdescription;
    if (req.body.duedate) projectFields.duedate = req.body.duedate;
    if (req.body.complete) projectFields.complete = req.body.complete;

    Project.findOne({ _id: req.params.id }).then((project) => {
      // Check to see if project exists
      if (project) {
        // Check if user matches project user
        if (project.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        // Update
        Project.findOneAndUpdate(
          { _id: req.params.id },
          { $set: projectFields },
          { new: true }
        ).then((project) => res.json(project));
      } else {
        return res
          .status(404)
          .json({ projectdoesnotexists: "Project does not exist" });
      }
    });
  }
);

// @route   DELETE api/project/:id
// @desc    Delete project || Leave project
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (
        profile.projects.filter(
          (project) => project._id.toString() === req.params.id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ projectdoesnotexist: "Project does not exist" });
      }

      // Get remove index
      const removeIndex = profile.projects
        .map((item) => item._id.toString())
        .indexOf(req.params.id);

      // Splice comment out of array
      profile.projects.splice(removeIndex, 1);

      profile.save();

      Project.findById(req.params.id)
        .then((project) => {
          // Check for project owner
          if (project.user.toString() === req.user.id) {
            // Delete Project
            project.remove().then((project) => res.json(project));
          } else {
            // Remove User
            const removeIndex = project.assigned
              .map((item) => item.user.toString())
              .indexOf(req.user.id);

            // Splice out of array
            project.assigned.splice(removeIndex, 1);

            // Save
            project.save().then((project) => res.json(project));
          }
        })
        .catch((err) =>
          res.status(404).json({ projectnotfound: "No project found" })
        );
    });
  }
);

// @route   DELETE api/projects/ticket/:id
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

        // Check to see if ticket exists
        if (
          project.tickets.filter(
            (ticket) => ticket._id.toString() === req.params.ticket_id
          ).length === 0
        ) {
          return res.json({ success: true });
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

// @route   DELETE api/projects/tickets/:id
// @desc    Delete ticket from project and ticket database
// @access  Private
router.delete(
  "/tickets/:id/:ticket_id/:pg",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        Ticket.findOne({ _id: req.params.ticket_id }).then((ticket) => {
          ticket.remove();
        });

        // Check to see if ticket exists
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
      .catch((err) =>
        res.status(404).json({ projectnoexists: "Project does not exist" })
      );
  }
);

module.exports = router;
