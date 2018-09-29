const express = require("express");

const logger = require("../util/logger");
const courseSvc = require("../services/courses/courseSvc");
const auth = require('../middleware/authenticate');
const {admin} = require('../middleware/authorize');

const router = express.Router();

/**
 * Return the list of courses
 */
router.get("/", auth, (req, res) => courseSvc.getCourses(req, res));

/**
 * Return course with the givne ID if found
 */
router.get("/:id", auth, (req, res) => courseSvc.findCourseByID(req, res));

/**
 * Adding a new course to course list
 */
router.post("/", [auth,admin], (req, res) => courseSvc.addCourse(req, res));

/**
 * Update course information with given values
 */
router.put("/:id", auth, (req, res) => courseSvc.updateCourse(req, res));

/**
 * Delete a course based on the given id
 */
router.delete("/:id", [auth,admin], (req, res) => courseSvc.deleteCourse(req, res));

module.exports = router;
