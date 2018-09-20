const Joi = require('joi');
const express = require("express");
const logger = require('../util/logger');

const router = express.Router();

const courses = [
  {
    id: 1,
    name: "Course 1"
  },
  {
    id: 2,
    name: "Course 2"
  },
  {
    id: 3,
    name: "Course 3"
  },
  {
    id: 4,
    name: "Course 4"
  },
];

/**
 * Return the list of courses
 */
router.get("/", (req, res) => {
  res.send(courses);
});

/**
 * Return course with the givne ID if found
 */
router.get("/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    res.status(404).send("Course with the given id is not found.");
  }
  return res.send(course);
});

/**
 * Adding a new course to course list
 */
router.post("/", (req, res) => {
  logger.debug("[index.js] post: /api/courses : ", req, req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  return res.send(course);
});

/**
 * Update course information with given values
 */
router.put("/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    return res.status(404).send("Course with the given id is not found.");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  return res.send(course);
});

/**
 * Delete a course based on the given id
 */
router.delete("/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    return res.status(404).send("Course with the given id is not found.");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  return res.send(course);
});

/**
 * Validate course information in user request with Joi schema
 * @param {Object} course
 */
const validateCourse = course => {
  logger.debug("[index.js] validateCourse: ", course);
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  const result = Joi.validate(course, schema);
  // logger.debug(result);
  return result;
};

/**
 * Find course by given ID
 * @param {String} id
 */
const findCourseByID = id => {
  return courses.find(c => c.id === parseInt(id));
};

module.exports = router;