const mongoose = require("../connection");
const logger = require("../../util/logger");

// Define schema for users
const UserSchema = new mongoose.Schema({
  // user name with basic validation rule
  name: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
    unique: true
  },
  roles: [String],
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  }
});

const User = mongoose.model("users", UserSchema);

/**
 * Return the list of users
 */
const getUsers = () => {
  const promise = new Promise((resolve, reject) => {
    User.find()
      .then(users => {
        resolve(users);
      })
      .catch(err => {
        logger.info("[userDao] Failed to load users", err);
        reject("Failed to load users");
      });
  });
  return promise;
};

/**
 * Return the list of users with specific attribute
 * refer to https://docs.mongodb.com/manual/reference/operator/query/
 * @param {Object} filter eg {isPublished:true, price: {$gt:15}
 * @param {*} select attributes to be retrieved: eg {name: 1, author: 1}
 * @param {*} sort the sorting sequence: eg {name:1, price: -1}
 */
const selectUsers = (filter, select, sort) => {
  const promise = new Promise((resolve, reject) => {
    User.find(filter)
      .limit(10)
      .sort(sort)
      .select(select)
      .then(users => {
        resolve(users);
      })
      .catch(err => {
        logger.info("[userDao] Failed to load users", err);
        reject("Failed to load users");
      });
  });
  return promise;
};

/**
 * Adding a new user to user list
 */
const addUser = userInfo => {
  logger.warn("[userDao] adding user", userInfo);
  const promise = new Promise((resolve, reject) => {
    const user = new User({
      ...userInfo
    });

    console.debug("[userDao] user to be added", user);
    user
      .save()
      .then(result => {
        logger.warn("[userDao] user is added", result);
        resolve(result);
      })
      .catch(err => {
        logger.warn("[userDao] failed to add user", err);
        reject("Failed to add user");
      });
  });
  return promise;
};

/**
 * Update user information with given values
 */
const updateUser = (id, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular user before update
    findUserByID(id)
      .then(user => {
        logger.debug("[userDao] Update user: existing info", user);
        user.set({ ...newInfo });
        user
          .save()
          .then(result => {
            logger.debug("[userDao] Update user: updated", result);
            resolve(result);
          })
          .catch(err => {
            console.warn("[userDao] Failed to update user", err);
            reject("Failed ot update user.");
          });
      })
      .catch(err => {
        logger.warn("[userDao] Could not find the user to update", err);
        reject("user with the given id is not found.");
      });
  });
  return promise;
};

/**
 * Delete a user based on the given id
 */
const deleteUser = id => {
  const promise = new Promise((resolve, reject) => {
    //User.findByIdAndDelete(id)
    User.deleteOne({ _id: id })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        logger.warn("[userDao] Delete user: failed to deletee", err);
        reject("Failed to delete user.");
      });
  });
  return promise;
};

/**
 * Find a user by given email 
 * @param {String} email 
 */
const findByEmail = email => {
  logger.debug("[userDao] findByEmail", email);
  const promise = new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then(user => {
        logger.debug("[userDao] findByEmail: user found", user);
        resolve(user);
      })
      .catch(err => {
        logger.debug("[userDao] findByEmail: user not found", err);
        reject(err);
      });
  });
  return promise;
};

/**
 * Find user by given ID
 * @param {String} id
 */
const findUserByID = id => {
  logger.debug("[userDao] findUserByID", id);
  const promise = new Promise((resolve, reject) => {
    User.findById(id)
      .then(user => {
        logger.debug("[userDao] findUserByID: user found", user);
        resolve(user);
      })
      .catch(err => {
        logger.debug("[userDao] findUserByID: user not found", err);
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
const updateUser2 = (id, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular user before update
    User.findByIdAndUpdate(id, {
      // using mongoose operator to update
      $set: {
        ...newInfo
      }
    })
      .then(result => {
        logger.debug("[userDao] Update user: updated", result);
        resolve(result);
      })
      .catch(err => {
        console.warn("[userDao] Failed to update user", err);
        reject("Failed ot update user.");
      });
  });
  return promise;
};

/**
 * Alternative way of updating DB records：
 * 2. Using update with MongoDB Update Operators
 * refer to https://docs.mongodb.com/manual/reference/operator/update/
 */
const updateUsers = (filter, newInfo) => {
  const promise = new Promise((resolve, reject) => {
    // Query the particular user before update
    User.update(filter, {
      // using mongoose operator to update
      $set: {
        ...newInfo
      }
    })
      .then(result => {
        logger.debug("[userDao] Update user: updated", result);
        resolve(result);
      })
      .catch(err => {
        console.warn("[userDao] Failed to update user", err);
        reject("Failed ot update user.");
      });
  });
  return promise;
};
module.exports = {
  addUser,
  getUsers,
  findUserByID,
  updateUser,
  deleteUser,
  findByEmail
};
