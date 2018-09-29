const express = require("express");
const logger = require('../util/logger');

const router = express.Router();

// Render the home page
router.get("/", (req, res) => {
  console.log(req);
  res.send("Hello Express");
});

module.exports = router;