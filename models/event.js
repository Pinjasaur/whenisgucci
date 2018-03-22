const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const eventSchema = new Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  granularity: Number,
  createdBy: Number,
  invitedTo: [ String ],
  timesSelected: [ Date ]
});

eventSchema.plugin(autoInc.plugin, "Event");
module.exports = mongoose.model("Event", eventSchema);
