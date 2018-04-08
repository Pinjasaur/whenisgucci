const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const responseSchema = new Schema({
  eventID: {
    type: Number,
    required: [true, 'EventID required for this response.']
  },
  timesSelected: {
    type: [ Date ],
    required: [true, 'Selected times required.']
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Responder email required.']
  },
  name: {
    type: String,
    required: [true, 'Responder name required.']
  }
});

responseSchema.plugin(autoInc.plugin, "Response");
module.exports = mongoose.model("Response", responseSchema);
