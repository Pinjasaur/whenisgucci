const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  _id: String,
  value: Number
});

module.exports = mongoose.model("Counter", counterSchema);
