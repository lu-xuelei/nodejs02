const express = require("express");
const home = require("./homeRoutes");
const courses = require("./courseRoutes");
const users = require("./userRoutes");
const auth = require("./authRoutes");

// Import middlewares
const errors = require("../middleware/errors");
const requestLogger = require("../middleware/requestLogger");

const routes = app => {
  // Invoke express.json() middleware to parse the request and populate request.body
  app.use(express.json());

  // Invoke mddleware to parse key=value pairs to request.body
  app.use(express.urlencoded({ extended: true }));

  // Invoke middleware to set static folder
  app.use(express.static("public"));

  // Invoke self-defind middleware functions in sequence and pass the request to next state
  app.use(requestLogger);

  // Routing requests to specific routes based on request URI
  app.use("/", home);
  app.use("/api/courses", courses);
  app.use("/api/users", users);
  app.use("/api/login", auth);

  // Add error handling middleware to bottom
  app.use(errors);
};

module.exports = routes;
