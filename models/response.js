const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const responseSchema = new Schema({
  eventID: Number,
  timesSelected: [ Date ],
  email: String,
  name: String
});

responseSchema.plugin(autoInc.plugin, "Response");
module.exports = mongoose.model("Response", responseSchema);
