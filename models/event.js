const express  = require("express");
const router   = express.Router();
const path     = require("path");
const mongoose = require("mongoose");
const db       = mongoose.connection;

// db.dropDatabase();

const TestSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const TestModel = mongoose.model("Test", TestSchema);

const test = new TestModel({ name: "Gurr", age: 22 }).save(err => {
  if (err) throw err;
  console.log("Saved!");
})

router.get("/test", (req, res, next) => {
  TestModel.find({}, "name age", (err, results) => {
    if (err) throw err;
    res.render("test", { results });
  });
});

module.exports = router;
