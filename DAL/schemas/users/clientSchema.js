const { Schema } = require("mongoose");

const clientSchema = new Schema({
  privacy_mode: String,
});

module.exports = clientSchema;
