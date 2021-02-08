const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");
// Load Project Model
const Project = require("../../models/Project");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/myprofile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "No Profiles Found";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "No Profiles Found" }));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "Profile not found";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json({ profile: "Profile not found" }));
});

// @route   GET api/profile/getuninvitedprofiles/:id
// @desc    Get all uninvited profiles from project id
// @access  Private
router.get(
  "/uninvitedprofiles/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.find({
      $and: [
        { "projects.project": { $ne: req.params.id } },
        { "requests.project": { $ne: req.params.id } },
      ],
    })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "No profiles found";
          res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((err) => res.status(404).json({ profile: "No profiles found" }));
  }
);

// @route   POST api/project/Invite
// @desc    Invite User to Project
// @access  Private
router.post(
  "/invite/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.params.id })
      .then((profile) => {
        const newRequest = {
          _id: req.body._id,
          project: req.body._id,
          projectname: req.body.projectname,
          projectdescription: req.body.projectdescription,
          name: req.body.name,
          user: req.body.user,
          date: req.body.date,
        };
        profile.requests.unshift(newRequest);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) =>
        res.status(404).json({ profilenotfound: "Profile not found" })
      );
  }
);

// @route   DELETE api/profile/cancelrequest/:id/:user_id
// @desc    Cancel Invitation Request
// @access  Private
router.delete(
  "/cancelrequest/:id/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.params.user_id })
      .then((profile) => {
        // Check if Request Exists
        if (
          profile.requests.filter(
            (request) => request._id.toString() === req.params.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ requestnotexists: "Request does not exist" });
        }

        // Get remove index
        const removeIndex = profile.requests
          .map((item) => item._id.toString())
          .indexOf(req.params.id);

        // Splice comment out of array
        profile.requests.splice(removeIndex, 1);

        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) =>
        res.status(404).json({ profilenotfound: "Profile not found" })
      );
  }
);

// @route   GET api/profile/pendingprofiles/:id
// @desc    Get all requested profiles from project id
// @access  Private
router.get(
  "/pendingprofiles/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.find({ requests: { $elemMatch: { project: req.params.id } } })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "No profiles found";
          res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((err) => res.status(404).json({ profile: "No profiles found" }));
  }
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.email) profileFields.email = req.body.email;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        new Profile(profileFields).save().then((profile) => res.json(profile));
      }
    });
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

// @route   POST api/profile/Invite
// @desc    Accept project invitation
// @access  Private
router.post(
  "/acceptrequest/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Add profile to project
    Project.findOne({ _id: req.params.id }).then((project) => {
      const newAssigned = {
        user: req.user.id,
        name: req.body.name,
        avatar: req.body.avatar,
      };
      project.assigned.unshift(newAssigned);
      project.save().then(() => {
        // Add project to profile
        Profile.findOne({ user: req.user.id }).then((profile) => {
          const newProject = {
            _id: req.params.id,
            project: req.params.id,
          };

          profile.projects.unshift(newProject);

          profile.save();

          res.json({ success: true });
        });
      });
    });
  }
);

// @route   DELETE api/profile/Invite
// @desc    Delete project Invitation
// @access  Private
router.delete(
  "/requests/:req_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.requests
          .map((item) => item.id)
          .indexOf(req.params.req_id);

        // Splice out of array
        profile.requests.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
