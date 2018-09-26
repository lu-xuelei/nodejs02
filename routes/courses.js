const express = require("express");

const logger = require("../util/logger");
const courseSvc = require("../services/courses/courseSvc");

const router = express.Router();

/**
 * Return the list of courses
 */
router.get("/", (req, res) => courseSvc.getCourses(req, res));

/**
 * Return course with the givne ID if found
 */
router.get("/:id", (req, res) => courseSvc.findCourseByID(req, res));

/**
 * Adding a new course to course list
 */
router.post("/", (req, res) => courseSvc.addCourse(req, res));

/**
 * Update course information with given values
 */
router.put("/:id", (req, res) => courseSvc.updateCourse(req, res));

/**
 * Delete a course based on the given id
 */
router.delete("/:id", (req, res) => courseSvc.deleteCourse(req, res));

module.exports = router;
