const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-plugin-autoinc");

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
    required: [true, 'End date is required.']
  },
  granularity: {
    type: Number,
    default: 30
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
    type: [ { startDate: Date, endDate: Date } ],
    required: [true, 'Dates required.']
  }
});

eventSchema.plugin(autoInc.plugin, "Event");
module.exports = mongoose.model("Event", eventSchema);
