const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creatorSchema = new Schema({
  _id: Number,
  email: String,
  events: [ Number ],
  token: String,
  expires: Date
});

module.exports = mongoose.model("Creator", creatorSchema);
