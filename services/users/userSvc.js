const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const logger = require("../../util/logger");

const userDao = require("../../dao/users/userDao");

/**
 * Return the list of users
 */

const getUsers = (req, res) => {
  userDao
    .getUsers()
    .then(users => {
      return res.send(users);
    })
    .catch(err => {
      logger.info("[userSvc] Failed to load users", err);
      return res.status(400).send("Failed to load users");
    });
};

/**
 * Return user with the givne ID if found
 */
const findUserByID = (req, res) => {
  userDao
    .findUserByID(req.params.id)
    .then(user => {
      return res.send(user);
    })
    .catch(err => {
      res.status(404).send("user with the given id is not found.");
    });
};

/**
 * Adding a new user to user list
 */
const addUser = (req, res) => {
  const newInfo = extractUserInfo(req.body);
  console.debug("[userSvc]] newInfo to be added", newInfo);
  const { error } = validateUser(newInfo);
  if (error) {
    console.debug("[userSvc]] newInfo invalid", error);
    return res.status(400).send(error.details[0].message);
  }

  encrypt(newInfo.password)
    .then(encryptedPassword => {
      newInfo.password = encryptedPassword;
      console.debug("[userSvc]] adding new user", newInfo);
      userDao.addUser(newInfo).then(result => {
        logger.warn("[userSvc] user is added", result);
        return res.send(_.pick(result, ["_id", "name", "email"]));
      });
    })
    .catch(err => {
      logger.warn("[userSvc] failed to added coruse", err);
      return res.status(400).send(err);
    });
};

/**
 * Update user information with given values
 */
const updateUser = (req, res) => {
  const newInfo = extractUserInfo(req.body);
  encrypt(newInfo.password)
    .then(encryptedPassword => {
      newInfo.password = encryptedPassword;
      userDao.updateUser(req.params.id, newInfo).then(result => {
        logger.debug("[userSvc] update user: updated", result);
        return res.send(result);
      });
    })
    .catch(err => {
      console.warn("[userSvc] Failed to update user", err);
      return res.status(400).send("Failed ot update user.");
    });
};

/**
 * Delete a user based on the given id
 */
const deleteUser = (req, res) => {
  userDao
    .deleteUser(req.params.id)
    .then(result => {
      return res.send(result);
    })
    .catch(err => {
      return res.status(404).send("user with the given id is not found.");
    });
};

/**
 * Validate user information in user request with Joi schema
 * @param {Object} user
 */
const validateUser = user => {
  logger.debug("[userSvc] validateUser: ", user);
  const schema = {
    name: Joi.string()
      .required()
      .min(8)
      .max(64),
    email: Joi.string()
      .required()
      .min(8)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  };

  const result = Joi.validate(user, schema);
  logger.debug("[userSvc] validateUser result: ", result);
  return result;
};

const extractUserInfo = reqBody => {
  // logger.debug("[userSvc].extractUserInfo: New user info is", reqBody);
  const newInfo = {};
  if (reqBody.name && reqBody.name.trim() !== "") {
    newInfo.name = reqBody.name;
  }
  if (reqBody.email && reqBody.email.trim() !== "") {
    newInfo.email = reqBody.email;
  }
  if (reqBody.password && reqBody.password.trim() !== "") {
    newInfo.password = reqBody.password;
  }
  if (reqBody.confirmPwd && reqBody.confirmPwd.trim() !== "") {
    newInfo.confirmPwd = reqBody.confirmPwd;
  }
  return newInfo;
};

/**
 * Hash the input with a random salt
 * @param {String} input 
 */
const encrypt = input => {
  const promise = new Promise((resolve, reject) => {
    bcrypt
      .genSalt(10)
      .then(salt => {
        bcrypt.hash(input, salt).then(output => {
          resolve(output);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
  return promise;
};

module.exports = {
  addUser,
  getUsers,
  findUserByID,
  updateUser,
  deleteUser
};
