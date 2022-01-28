const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  email: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  requests: [
    {
      project: {
        type: Schema.Types.ObjectId,
        ref: "project",
      },
      projectname: {
        type: String,
      },
      projectdescription: {
        type: String,
      },
      name: {
        type: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      date: {
        type: Date,
      },
      datereceived: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  projects: [
    {
      project: {
        type: Schema.Types.ObjectId,
        ref: "project",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
