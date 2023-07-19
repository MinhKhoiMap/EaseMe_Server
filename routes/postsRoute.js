const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const PostModelClass = require("../DAL/models/postModel");

const postsRouter = Router();
const PostModel = new PostModelClass();

/*------------------ Get All Posts --------------------*/
postsRouter.get("/all-posts", (req, res) => {
  PostModel.getAllPosts().then((response) => {
    res.status(StatusCodes.OK).json(response);
  });
});

/*------------------ Get Post By ID Post --------------------*/
postsRouter.get("/post/:post", (req, res) => {
  let id = req.params.post;
  // console.log("id post");

  PostModel.getPostById(id)
    .then((response) => {
      res.status(StatusCodes.OK).json(response);
    })
    .catch((err) => console.log(err));
});

/*------------------ Get User Post--------------------*/

postsRouter.get("/my-posts", (req, res) => {
  let userID = req.user._id;

  PostModel.getUserPosts(userID)
    .then((posts) => {
      // console.log(posts, "user post");
      res
        .status(StatusCodes.OK)
        .json({ posts: posts, message: "get user posts successfully" });
    })
    .catch((err) => {
      console.log(err, "get user posts failed");
    });
});

/*------------------ Get Posts By TAG Id --------------------*/
postsRouter.get("/tags/:tag", (req, res) => {
  let id_tag = req.params.tag;

  PostModel.getAllPostsWithTag(id_tag)
    .then((post) => res.status(StatusCodes.OK).json({ post }))
    .catch((e) => console.log(e, "err at tag post"));
});

/*------------------ Create a new Post --------------------*/
postsRouter.post("/create-post", (req, res) => {
  let post = req.body;
  // console.log(post, "post");

  post.user = req.user._id;

  PostModel.createPost(post)
    .then((response) => {
      // console.log(response, "res o inserting post");
      res.status(StatusCodes.CREATED).json({ message: "posting successfully" });
    })
    .catch((e) => console.log(e, "at inserting post"));
});

/*------------------ Edit post --------------------*/
postsRouter.patch("/edit-post/:postID", (req, res) => {
  let postID = req.params.postID;
  let post = req.body;

  // console.log(post, "edit content post");

  PostModel.editPost(postID, post)
    .then((response) => {
      res
        .status(StatusCodes.OK)
        .json({ post: response, message: "editing post successfully" });
    })
    .catch((err) => {
      console.log(err, "error at editing post");
      res.status(StatusCodes.GATEWAY_TIMEOUT).json({ message: err.message });
    });
});

/*------------------ Delete post --------------------*/
postsRouter.delete("/delete-post/:postID", (req, res) => {
  let postID = req.params.postID;

  PostModel.deletePost(postID)
    .then((response) => {
      console.log(response, "delete post");
      res
        .status(StatusCodes.OK)
        .json({ message: "delete post successfully", postDeleted: response });
    })
    .catch((err) => {
      console.log(err, "error deleting post");
    });
});

module.exports = postsRouter;
