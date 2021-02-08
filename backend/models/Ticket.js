const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TicketSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "project",
  },
  projectname: {
    type: String,
  },
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
  assignedname: {
    type: String,
  },
  assigneduser: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  ticketname: {
    type: String,
    required: true,
  },
  ticketdescription: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  complete: {
    type: String,
    default: "Open",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  duedate: {
    type: Date,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      comment: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);
