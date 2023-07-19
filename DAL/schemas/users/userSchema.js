const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    uinque: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  join_date: {
    type: Date,
    required: true,
  },
  avatar_url: String,
  wallpaper_url: String,
  avatar_full_url: String,
  wallpaper_full_url: String,
  role: {
    type: String,
    required: true,
    enum: ["clients", "psychologists"],
  },
  details: {
    type: Schema.Types.ObjectId,
    refPath: "role",
    required: true,
  },
});

module.exports = userSchema;
