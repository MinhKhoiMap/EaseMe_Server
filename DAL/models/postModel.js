const mongoose = require("mongoose");
const postSchema = require("../schemas/posts/postSchema");
const tagsSchema = require("../schemas/posts/tagsSchema");

class PostModelClass {
  constructor() {
    this.model = mongoose.model("posts", postSchema);
    this.tag = mongoose.model("tags", tagsSchema);
  }

  getAllPosts() {
    return this.model.find();
  }

  getUserPosts(id_user) {
    return this.model.find({ user: id_user }).populate("tag");
  }

  getPostById(id) {
    return this.model.findById(id).populate("tag");
  }

  getAllPostsWithTag(id_tag) {
    return this.model.find({ id_tag });
  }

  createPost(post) {
    return this.model.create(post);
  }

  editPost(id_post, post) {
    return this.model.findByIdAndUpdate(
      id_post,
      { ...post },
      { overwrite: false, returnDocument: "after" }
    );
  }

  deletePost(id_post) {
    return this.model.findByIdAndDelete(id_post);
  }
}

module.exports = PostModelClass;
