const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const creatorSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Creator\'s  email required.']
  },
  events: {
    type: [ Number ],
    required: [true, 'Creator must have events.']
  },
  authenticated: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  expires: {
    type: Date
  }
});

creatorSchema.plugin(autoInc.plugin, "Creator");
module.exports = mongoose.model("Creator", creatorSchema);
