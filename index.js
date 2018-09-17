const Joi = require("joi");
const express = require("express");

const app = express();
app.use(express.json())

const courses = [
  {
    id: 1,
    name: "Course 1"
  },
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
  }
];
/**
 * app.get will listen to get requests
 */
app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello Express");
});

/**
 * Return the list of courses
 */
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

/**
 * Return course with the givne ID if found
 */
app.get("/api/courses/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    res.status(404).send("Course with the given id is not found.");
  }
  res.send(course);
});

/**
 * Adding a new course to course list
 */
app.post("/api/courses", (req, res) => {
  console.log("[index.js] post: /api/courses : ", req, req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

/**
 * Update course information with given values
 */
app.put("/api/courses/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    res.status(404).send("Course with the given id is not found.");
    return;
  }

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

/**
 * Validate course information in user request with Joi schema
 * @param {Object} course
 */
const validateCourse = course => {
  console.log("[index.js] validateCourse: ", course)
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  const result = Joi.validate(course, schema);
  // console.log(result);
  return result;
};

/**
 * Find course by given ID
 * @param {String} id
 */
const findCourseByID = id => {
  return courses.find(c => c.id === parseInt(id));
};

/**
 * Try to log port from environment if available
 * To set a env variable:
 * Unix: export PORT=5000
 * CMD: set PORT=5000
 * PS: $env:PORT=5000
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
