const { Schema } = require("mongoose");

const tagsSchema = new Schema({
  colorText: String,
  backgroundColor: String,
  colorDisc: String,
  borderColor: String,
  tag: String,
});

module.exports = tagsSchema;
