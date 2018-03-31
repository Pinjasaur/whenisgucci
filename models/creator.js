const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const creatorSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Creator\'s  email required.']
  },
  events: {
    type: [ Number ],
    required: [true, 'Creator must have events.']
  },
  token: {
    type: String,
    required: [true, 'Creator has no token.']
  },
  expires: {
    type: Date,
    required: [true, 'Token expiration date required.']
  }
});

creatorSchema.plugin(autoInc.plugin, "Creator");
module.exports = mongoose.model("Creator", creatorSchema);
