const express  = require("express");
const router   = express.Router();

router.get("/event/:id/results", (req, res, next) => {
  res.render("event/results");
});

module.exports = router;
