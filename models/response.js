const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const responseSchema = new Schema({
  _id: Number,
  eventID: Number,
  timesSelected: [ Date ],
  email: String,
  name: String
});

module.exports = mongoose.model("Response", responseSchema);
