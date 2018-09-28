const express = require("express");

const userSvc = require("../services/users/userSvc");
const auth = require('../middleware/authenticate');

const router = express.Router();

/**
 * Return the list of users
 */
router.get("/", auth, (req, res) => userSvc.getUsers(req, res));

/**
 * Return user info of the logged in user
 */
router.get("/me", auth, (req, res) => userSvc.findMe(req, res));

/**
 * Return user with the givne ID if found
 */
router.get("/:id", auth, (req, res) => userSvc.findUserByID(req, res));

/**
 * Adding a new user to user list
 */
router.post("/", (req, res) => userSvc.addUser(req, res));

/**
 * Update user information with given values
 */
router.put("/:id", auth, (req, res) => userSvc.updateUser(req, res));

/**
 * Delete a user based on the given id
 */
router.delete("/:id", auth, (req, res) => userSvc.deleteUser(req, res));

module.exports = router;
