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
 * Return the list of courses with specific attribute
 * refer to https://docs.mongodb.com/manual/reference/operator/query/
 * @param {Object} filter eg {isPublished:true, price: {$gt:15}
 * @param {*} select attributes to be retrieved: eg {name: 1, author: 1}
 * @param {*} sort the sorting sequence: eg {name:1, price: -1}
 */
const selectCourses = (filter, select, sort) => {
  const promise = new Promise((resolve, reject) => {
    Course.find(filter)
      .limit(10)
      .sort(sort)
      .select(select)
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
    //Course.findByIdAndDelete(id)
    Course.deleteOne({ _id: id })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        logger.warn("[coursesDao] Delete course: failed to deletee", err);
        reject("Failed to delete course.");
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

/**
 * Alternative way of updating DB records：
 * 1. Using findByIdAndUpdate with MongoDB Update Operators
 * refer to https://docs.mongodb.com/manual/reference/operator/update/
 */
const updateCourse2 = (id, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular course before update
    Course.findByIdAndUpdate(id, {
      // using mongoose operator to update
      $set: {
        ...newInfo
      }
    })
      .then(result => {
        logger.debug("[coursesDao] Update course: updated", result);
        resolve(result);
      })
      .catch(err => {
        console.warn("[coursesDao] Failed to update course", err);
        reject("Failed ot update course.");
      });
  });
  return promise;
};

/**
 * Alternative way of updating DB records：
 * 2. Using update with MongoDB Update Operators
 * refer to https://docs.mongodb.com/manual/reference/operator/update/
 */
const updateCourses = (filter, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular course before update
    Course.update(filter, {
      // using mongoose operator to update
      $set: {
        ...newInfo
      }
    })
      .then(result => {
        logger.debug("[coursesDao] Update course: updated", result);
        resolve(result);
      })
      .catch(err => {
        console.warn("[coursesDao] Failed to update course", err);
        reject("Failed ot update course.");
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
