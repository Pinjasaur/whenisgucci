const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Event title is required.']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required.']
  },
  endDate: {
    type: Date,
    default: (Date.startDate + 7*24*60*60*1000)
  },
  granularity: {
    type: Number,
    default: 30,
  },
  createdBy: {
    type: Number,
    required: [true, 'Creator ID required.']
  },
  invitedTo: {
    type: [ String ],
    required: [true, 'Invitees required.']
  },
  timesSelected: {
    type: [ Date ],
    required: [true, 'Dates required.']
  }
});

eventSchema.plugin(autoInc.plugin, "Event");
module.exports = mongoose.model("Event", eventSchema);
