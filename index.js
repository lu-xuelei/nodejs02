const Joi = require("joi");
const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const logger = require('./logging');
const authenticate = require('./authenticate');

const app = express();

// Invoke express.json() middleware to parse the request and populate request.body
app.use(express.json());

// Invoke mddleware to parse key=value pairs to request.body
app.use(express.urlencoded({extended: true}));

// Invoke middleware to set static folder
app.use(express.static('public'));

app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// Invoke self-defind middleware functions in sequence and pass the request to next state
app.use(logger);
app.use(authenticate);

console.log('Mail Host: ', config.get('email.host'))
console.log('Mail Host: ', config.get('email.password'))

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
    return res.status(404).send("Course with the given id is not found.");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

/**
 * Delete a course based on the given id
 */
app.delete("/api/courses/:id", (req, res) => {
  const course = findCourseByID(req.params.id);
  if (!course) {
    return res.status(404).send("Course with the given id is not found.");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

/**
 * Validate course information in user request with Joi schema
 * @param {Object} course
 */
const validateCourse = course => {
  console.log("[index.js] validateCourse: ", course);
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
