const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const autoInc  = require("mongoose-auto-increment");

const creatorSchema = new Schema({
  email: String,
  events: [ Number ],
  token: String,
  expires: Date
});

creatorSchema.plugin(autoInc.plugin, "Creator");
module.exports = mongoose.model("Creator", creatorSchema);
