const { Schema } = require("mongoose");

const psychologistSchema = new Schema({
  star_number: Number,
});

module.exports = psychologistSchema;
