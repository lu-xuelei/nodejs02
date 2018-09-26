const express = require("express");

const userSvc = require("../services/users/userSvc");

const router = express.Router();

/**
 * Return the list of users
 */
router.get("/", (req, res) => userSvc.getUsers(req, res));

/**
 * Return user with the givne ID if found
 */
router.get("/:id", (req, res) => userSvc.findUserByID(req, res));

/**
 * Adding a new user to user list
 */
router.post("/", (req, res) => userSvc.addUser(req, res));

/**
 * Update user information with given values
 */
router.put("/:id", (req, res) => userSvc.updateUser(req, res));

/**
 * Delete a user based on the given id
 */
router.delete("/:id", (req, res) => userSvc.deleteUser(req, res));

module.exports = router;
