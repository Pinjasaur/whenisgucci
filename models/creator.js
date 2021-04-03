const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoInc = require("mongoose-plugin-autoinc");

const creatorSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Creator's  email required."]
    },
    events: {
      type: [Number],
      required: [true, "Creator must have events."]
    },
    authenticated: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      required: [true, "Creator must have a token."]
    },
    expires: {
      type: Date
    }
  },
  { timestamps: true }
);

creatorSchema.plugin(autoInc.plugin, "Creator");
module.exports = mongoose.model("Creator", creatorSchema);
