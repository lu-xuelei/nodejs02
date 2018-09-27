const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const logger = require("../../util/logger");

const userDao = require("../../dao/users/userDao");

/**
 * Return user with the givne ID if found
 */
const authUser = (req, res) => {
  const authInfo = extractUserInfo(req.body);
  console.debug("[authSvc]] User try to login", authInfo.email);
  const { error } = validateUser(authInfo);
  if (error) {
    console.debug("[authSvc]] auth invalid", error);
    return res.status(400).send(error.details[0].message);
  }
  userDao
    .findByEmail(authInfo.email)
    .then(user => {
      bcrypt.compare(authInfo.email, user.password).then(result => {
        console.debug("[authSvc]] auth success", result);
        if (result) {
          return res.send(true);
        } else {
          return res.status(400).send("Invalid email or password");
        }
      });
    })
    .catch(err => {
      console.debug("[authSvc]] auth failed", err);
      return res.status(400).send("Invalid email or password");
    });
};

/**
 * Validate user information in user request with Joi schema
 * @param {Object} user
 */
const validateUser = user => {
  logger.debug("[authSvc] validateUser: ", user);
  const schema = {
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
  logger.debug("[authSvc] validateUser result: ", result);
  return result;
};

const extractUserInfo = reqBody => {
  // logger.debug("[authSvc].extractUserInfo: New user info is", reqBody);
  const reqInfo = {};
  if (reqBody.email && reqBody.email.trim() !== "") {
    reqInfo.email = reqBody.email;
  }
  if (reqBody.password && reqBody.password.trim() !== "") {
    reqInfo.password = reqBody.password;
  }
  return reqInfo;
};

module.exports = {
  authUser
};
