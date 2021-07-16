const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  assigned: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      role: {
        type: String,
        default: "Unassigned",
      },
    },
  ],
  tickets: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "ticket",
      },
    },
  ],
  projectname: {
    type: String,
    required: true,
  },
  projectdescription: {
    type: String,
    required: true,
  },
  duedate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  complete: {
    type: String,
    default: "In Progress",
  },
});

module.exports = Project = mongoose.model("project", ProjectSchema);
