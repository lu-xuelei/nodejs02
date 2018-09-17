let express = require("express");

const app = express();

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
  res.status(200).send("Hello Express");
});

/**
 * Return the list of courses
 */
app.get("/api/courses", (req, res) => {
  res.status(200).send(courses);
});

/**
 * Return course with the givne ID if found
 */
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course with the given id is not found.");
  }
  res.send(course);
});

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
