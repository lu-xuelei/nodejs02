const Joi = require("joi");

const logger = require("../../util/logger");

const courseDao = require("../../dao/courses/coursesDao");

/**
 * Return the list of courses
 */

const getCourses = (req, res) => {
  courseDao
    .getCourses()
    .then(courses => {
      return res.send(courses);
    })
    .catch(err => {
      logger.info("[coursesSvc] Failed to load courses", err);
      return res.status(400).send("Failed to load courses");
    });
};

/**
 * Return course with the givne ID if found
 */
const findCourseByID = (req, res) => {
  courseDao
    .findCourseByID(req.params.id)
    .then(course => {
      return res.send(course);
    })
    .catch(err => {
      res.status(404).send("Course with the given id is not found.");
    });
};

/**
 * Adding a new course to course list
 */
const addCourse = (req, res) => {
  const newInfo = extractCourseInfo(req.body);
  console.debug("[courses.js] newInfo to be added", newInfo);

  courseDao
    .addCourse(newInfo)
    .then(result => {
      logger.warn("[courses.js] course is added", result);
      return res.send(result);
    })
    .catch(err => {
      logger.warn("[courses.js] failed to added coruse", err);
      return res.status(400).send(err);
    });
};

/**
 * Update course information with given values
 */
const updateCourse = (req, res) => {
  const newInfo = extractCourseInfo(req.body);
  courseDao
    .updateCourse(req.params.id, newInfo)
    .then(result => {
      logger.debug("[courses.js] update course: updated", result);
      return res.send(result);
    })
    .catch(err => {
      console.warn("[courses.js] Failed to update course", err);
      return res.status(400).send("Failed ot update course.");
    });
};

/**
 * Delete a course based on the given id
 */
const deleteCourse = (req, res) => {
  courseDao
    .deleteCourse(req.params.id)
    .then(result => {
      return res.send(result);
    })
    .catch(err => {
      return res.status(404).send("Course with the given id is not found.");
    });
};

/**
 * Validate course information in user request with Joi schema
 * @param {Object} course
 */
const validateCourse = course => {
  logger.debug("[coruses.js] validateCourse: ", course);
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  const result = Joi.validate(course, schema);
  logger.debug("[coruses.js] validateCourse result: ", result);
  return result;
};

const extractCourseInfo = reqBody => {
  // logger.debug("[courses.js].extractCourseInfo: New course info is", reqBody);
  const newInfo = {};
  if (reqBody.name && reqBody.name.trim() !== "") {
    newInfo.name = reqBody.name;
  }
  if (reqBody.author && reqBody.author.trim() !== "") {
    newInfo.author = reqBody.author;
  }
  if (reqBody.category && reqBody.category.trim() !== "") {
    newInfo.category = reqBody.category;
  }
  if (reqBody.isPublished !== undefined) {
    newInfo.isPublished = reqBody.isPublished;
  }
  if (reqBody.price) {
    newInfo.price = reqBody.price;
  }
  if (reqBody.tags) {
    newInfo.tags = reqBody.tags;
  }
  // logger.debug("[courses.js].extractCourseInfo: New course info is", newInfo);
  return newInfo;
};

module.exports = {
  addCourse,
  getCourses,
  findCourseByID,
  updateCourse,
  deleteCourse
};
