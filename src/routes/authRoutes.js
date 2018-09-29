const express = require("express");

const authSvc = require("../services/auth/authSvc");

const router = express.Router();

/**
 * User authentication
 */
router.post("/", (req, res) => authSvc.authUser(req, res));

module.exports = router;
