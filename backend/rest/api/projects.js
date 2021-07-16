const express = require("express");
const router = express.Router();
const passport = require("passport");

const Project = require("../../models/project");
const Profile = require("../../models/profile");
const Ticket = require("../../models/ticket");

const validateProjectInput = require("../../validation/project");
const validateProjectUserInput = require("../../validation/projectuser");

// Get projects
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

// Get project by id
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

// Get project by id and pg
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

        const limit = 15;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const maxPage =
          Math.ceil(project.tickets.length / limit) < 1
            ? 1
            : Math.ceil(project.tickets.length / limit);

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

// Create project and add project to owners profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    if (!isValid) {
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

// Edit User Role
router.post(
  "/edit-user/:project_id/:user_id/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectUserInput(req.body);

    if (!isValid) {
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

        project.assigned.splice(removeIndex, 1);

        project.assigned.unshift(updatedUser);

        project.save().then(() => res.json({ success: true }));
      })
      .catch((err) => res.status(404).json({ project: "Project not found" }));
  }
);

// Remove user from Project
router.delete(
  "/removeuser/:id/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        if (
          project.assigned.filter(
            (assign) => assign.user.toString() === req.params.user_id
          ).length === 0
        ) {
          return res.status(404).json({ usernotexists: "User does not exist" });
        }

        const removeIndex = project.assigned
          .map((item) => item.user.toString())
          .indexOf(req.params.user_id);

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

              const removeIndex = profile.projects
                .map((item) => item.project.toString())
                .indexOf(req.params.id);

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

// Edit Project
router.post(
  "/edit-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const projectFields = {};
    projectFields.user = req.user.id;
    if (req.body.projectname) projectFields.projectname = req.body.projectname;
    if (req.body.projectdescription)
      projectFields.projectdescription = req.body.projectdescription;
    if (req.body.duedate) projectFields.duedate = req.body.duedate;
    if (req.body.complete) projectFields.complete = req.body.complete;

    Project.findOne({ _id: req.params.id }).then((project) => {
      if (project) {
        if (project.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
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

// Delete project || Leave project
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

      const removeIndex = profile.projects
        .map((item) => item._id.toString())
        .indexOf(req.params.id);

      profile.projects.splice(removeIndex, 1);

      profile.save();

      Project.findById(req.params.id)
        .then((project) => {
          if (project.user.toString() === req.user.id) {
            project.remove().then((project) => res.json(project));
          } else {
            const removeIndex = project.assigned
              .map((item) => item.user.toString())
              .indexOf(req.user.id);

            project.assigned.splice(removeIndex, 1);

            project.save().then((project) => res.json(project));
          }
        })
        .catch((err) =>
          res.status(404).json({ projectnotfound: "No project found" })
        );
    });
  }
);

// Delete ticket from project and ticket database
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

        if (
          project.tickets.filter(
            (ticket) => ticket._id.toString() === req.params.ticket_id
          ).length === 0
        ) {
          return res.json({ success: true });
        }

        const removeIndex = project.tickets
          .map((item) => item._id.toString())
          .indexOf(req.params.ticket_id);

        project.tickets.splice(removeIndex, 1);

        project.save().then(() => res.json({ success: true }));
      })
      .catch((err) => res.json({ success: true }));
  }
);

// Delete ticket from project and ticket database
router.delete(
  "/tickets/:id/:ticket_id/:pg",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        Ticket.findOne({ _id: req.params.ticket_id }).then((ticket) => {
          ticket.remove();
        });

        if (
          project.tickets.filter(
            (ticket) => ticket._id.toString() === req.params.ticket_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ ticketnotexists: "Ticket does not exist" });
        }
        const removeIndex = project.tickets
          .map((item) => item._id.toString())
          .indexOf(req.params.ticket_id);

        project.tickets.splice(removeIndex, 1);

        project.save().then(() => res.json({ success: true }));
      })
      .catch((err) =>
        res.status(404).json({ projectnoexists: "Project does not exist" })
      );
  }
);

module.exports = router;
