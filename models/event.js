const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  granularity: Number,
  createdBy: String,
  invitedTo: [ String ],
  timesSelected: [ Date ]
});

module.exports = mongoose.model("Event", eventSchema);
