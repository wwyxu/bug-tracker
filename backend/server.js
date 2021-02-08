const express = require("express");
// MongoDB
const mongoose = require("mongoose");
// Express: BodyParser is a middleware module which handles http post requests
const bodyParser = require("body-parser");
// Passport is a method of jwt authentication
const passport = require("passport");
// Node.js: The path module provides utilities for working with file and directory paths
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const projects = require("./routes/api/projects");
const tickets = require("./routes/api/tickets");

// Express handles things like cookies, parsing the request body, forming the response and handling routes.
// It also is the part of the application that listens to a socket to handle incoming requests.
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Express using Passport authentication middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/projects", projects);
app.use("/api/tickets", tickets);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
