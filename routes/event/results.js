const express  = require("express");
const router   = express.Router();
const path     = require("path");

router.get("/event/:id/results", (req, res, next) => {
  res.render("event/results");
});

module.exports = router;
