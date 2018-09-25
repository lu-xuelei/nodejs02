const mongoose = require("mongoose");

const logger = require("../../util/logger");

// Connect to mongo database
mongoose
  .connect(
    "mongodb://localhost/nodejs01",
    { useNewUrlParser: true }
  )
  .then(() => {
    logger.debug("[coursesDao] Connected to nodejs01");
  })
  .catch(err => {
    logger.debug("[CoursesDao] Failed to connect to nodejs01");
  });

// Define schema for courses
const CourseSchema = new mongoose.Schema({
  // Course name with basic validation rule
  name: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64
  },
  author: String,
  // Enum course category
  category: {
    type: String,
    enum: ["web", "java", "nodejs"],
    required: true,
    lowercase: true
  },
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "There must be at least one tag"
    }
  },
  isPublished: Boolean,
  // Price is required if the book is published
  price: {
    type: Number,
    required: function() {
      return this.isPublished;
    },
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

const Course = mongoose.model("courses", CourseSchema);

/**
 * Return the list of courses
 */
const getCourses = () => {
  const promise = new Promise((resolve, reject) => {
    Course.find()
      .then(courses => {
        resolve(courses);
      })
      .catch(err => {
        logger.info("[coursesDao] Failed to load courses", err);
        reject("Failed to load courses");
      });
  });
  return promise;
};

/**
 * Adding a new course to course list
 */
const addCourse = courseInfo => {
  const promise = new Promise((resolve, reject) => {
    const course = new Course({
      ...courseInfo
    });

    console.debug("[coursesDao] Course to be added", course);
    course
      .save()
      .then(result => {
        logger.warn("[coursesDao] Course is added", result);
        resolve(result);
      })
      .catch(err => {
        logger.warn("[coursesDao] failed to added coruse", err);
        reject("Failed to add course");
      });
  });
  return promise;
};

/**
 * Update course information with given values
 *
 * In this method, the program query the course first before updating.
 *
 * There is another approach of updating mongoDB records which is to
 * update based on condition by calling the model.update({},{}) method
 * with mongoose operators
 */
const updateCourse = (id, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular course before update
    findCourseByID(id)
      .then(course => {
        logger.debug("[coursesDao] Update course: existing info", course);
        course.set({ ...newInfo });
        course
          .save()
          .then(result => {
            logger.debug("[coursesDao] Update course: updated", result);
            resolve(result);
          })
          .catch(err => {
            console.warn("[coursesDao] Failed to update course", err);
            reject("Failed ot update course.");
          });
      })
      .catch(err => {
        logger.warn("[coursesDao] Could not find the course to update", err);
        reject("Course with the given id is not found.");
      });
  });
  return promise;
};

/**
 * Delete a course based on the given id
 */
const deleteCourse = id => {
  const promise = new Promise((resolve, reject) => {
    findCourseByID(req.params.id)
      .then(course => {
        logger.warn("[coursesDao] Delete course: course found", course);
        course
          .remove()
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            logger.warn("[coursesDao] Delete course: failed to deletee", err);
            reject("Failed to delete course.");
          });
      })
      .catch(err => {
        logger.warn("[coursesDao] Could not find the course to delete", err);
        reject("Course with the given id is not found.");
      });
  });
  return promise;
};

/**
 * Find course by given ID
 * @param {String} id
 */
const findCourseByID = id => {
  logger.debug("[courses] findCourseByID", id);
  const promise = new Promise((resolve, reject) => {
    Course.findById(id)
      .then(course => {
        logger.debug("[courses] findCourseByID: course found", course);
        resolve(course);
      })
      .catch(err => {
        logger.debug("[courses] findCourseByID: course not found", err);
        reject(err);
      });
  });
  return promise;
};

module.exports = {
  addCourse,
  getCourses,
  findCourseByID,
  updateCourse,
  deleteCourse
};
