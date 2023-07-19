const { Schema } = require("mongoose");

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  reaction_number: Number,
  privacy: {
    type: String,
    required: true,
  },
  deleted: Boolean,
  tag: {
    type: String,
    ref: "tags",
    required: true,
  },
});

module.exports = postSchema;
