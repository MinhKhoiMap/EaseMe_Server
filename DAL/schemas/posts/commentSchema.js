const { Schema } = require("mongoose");

const commentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  psychologist: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  like_number: Number,
  date_post: Date,
});

module.exports = commentSchema;
