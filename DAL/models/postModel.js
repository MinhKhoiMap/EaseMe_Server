const mongoose = require("mongoose");
const postSchema = require("../schemas/posts/postSchema");
const tagsSchema = require("../schemas/posts/tagsSchema");

class PostModelClass {
  constructor() {
    this.model = mongoose.model("posts", postSchema);
    this.tag = mongoose.model("tags", tagsSchema);
  }

  getAllPublicPosts() {
    return this.model
      .find({ privacy: "Public" })
      .populate("tag", "-__v")
      .populate("user", "name avatar_url role details");
  }

  getUserPosts(id_user) {
    return this.model.find({ user: id_user }).populate("tag", "-__v");
  }

  getPostById(id) {
    return this.model.findById(id).populate("tag");
  }

  getAllPublicPostsWithTag(id_tag) {
    return this.model
      .find({ tag: id_tag, privacy: "Public" }, "-__v")
      .populate("tag", "-__v")
      .populate("user", "name avatar_url role");
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
