const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  _id: Number,
  title: String,
  startDate: Date,
  endDate: Date,
  granularity: Number,
  createdBy: Number,
  invitedTo: [ String ],
  timesSelected: [ Date ]
});

module.exports = mongoose.model("Event", eventSchema);
