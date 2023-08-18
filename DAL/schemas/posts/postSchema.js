const { Schema } = require("mongoose");

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  contentText: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  reaction_number: Number,
  privacy: {
    type: String,
    required: true,
  },
  postDate: {
    type: String,
    required: true,
  },
  deleted: Boolean,
  tag: {
    type: String,
    ref: "tags",
    required: true,
  },
  listUserLike: Array,
});

module.exports = postSchema;
