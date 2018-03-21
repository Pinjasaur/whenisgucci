const express  = require("express");
const router   = express.Router();
const path     = require("path");

router.get("/create", (req, res, next) => {
  res.render("create");
});

module.exports = router;
