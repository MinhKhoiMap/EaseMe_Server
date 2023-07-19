const mongoose = require("mongoose");
const tagsSchema = require("../schemas/posts/tagsSchema");

class TagModelClass {
  constructor() {
    this.model = new mongoose.model("tags", tagsSchema);
  }

  getAllTags() {
    return this.model.find();
  }
}

module.exports = TagModelClass;
