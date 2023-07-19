const mongoose = require("mongoose");
const commentSchema = require("../schemas/posts/commentSchema");
const userSchema = require("../schemas/users/userSchema");

class CommentModelClass {
  constructor() {
    this.model = new mongoose.model("comments", commentSchema);
    this.user = new mongoose.model("users", userSchema);
  }

  getComments(id_post) {
    return this.model.find({ post: id_post });
  }

  createComment(id_post, id_psychologist, content) {
    return this.model.create({
      post: id_post,
      psychologist: id_psychologist,
      content,
      date_post: new Date().toLocaleDateString(),
    });
  }

  deleteComment(id_comment, id_user) {
    return this.model.findOneAndDelete({
      _id: id_comment,
      psychologist: id_user,
    });
  }
}

module.exports = CommentModelClass;
