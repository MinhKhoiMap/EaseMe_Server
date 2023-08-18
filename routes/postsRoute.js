const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const PostModelClass = require("../DAL/models/postModel");
const UserModelClass = require("../DAL/models/usersModel");
const { handlePrivacyPost } = require("../utils/handlePrivacyPost");
const { getUserIDFromToken } = require("../utils/verifyToken");
const authenticate = require("../middlewares/authenticate");

const multer = require("multer");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebaseApp = require("../DAL/firebase.config");

const postsRouter = Router();
const PostModel = new PostModelClass();
const UserModel = new UserModelClass();

const uploadHandler = multer();
const firebaseStorage = getStorage(firebaseApp);

/*------------------ Get All Posts --------------------*/
postsRouter.get("/all-posts", async (req, res) => {
  const userID = getUserIDFromToken(req.headers.authorization);
  PostModel.getAllPublicPosts()
    .then((posts) => {
      const newPosts = [];
      posts.forEach((post, index) => {
        // console.log("first", index);
        let ref = handlePrivacyPost(post._doc, userID);
        // console.log("end", index);
        newPosts.push(ref);
      });
      return newPosts;
    })
    .then((posts) => {
      res
        .status(StatusCodes.OK)
        .json({ message: "get all posts successfully", posts });
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

postsRouter.get("/my-posts", authenticate, (req, res) => {
  let userID = req.user._id;

  PostModel.getUserPosts(userID)
    .then((posts) => {
      const newPosts = [];
      posts.forEach((post, index) => {
        // console.log("first", index);
        if (post.listUserLike.includes(userID)) {
          post._doc.isReacted = true;
        }
        // console.log("end", index);
        newPosts.push(post);
      });
      return newPosts;
    })
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

/*------------------ Get Posts By TAG ID --------------------*/
postsRouter.get("/tag/:tag", (req, res) => {
  let id_tag = req.params.tag;
  const userID = getUserIDFromToken(req.headers.authorization);

  PostModel.getAllPublicPostsWithTag(id_tag)
    .then((posts) => {
      let newPosts = [];
      for (let i = 0; i < posts.length; i++)
        newPosts.push(handlePrivacyPost(posts[i]._doc, userID));

      return newPosts;
    })
    .then((posts) => {
      // console.log(posts, "haizz");
      res
        .status(StatusCodes.OK)
        .json({ message: "get post successfully", posts });
    })
    .catch((e) => console.log(e, "err at tag post"));
});

/*------------------ Create a new Post --------------------*/
postsRouter.post("/create-post", authenticate, (req, res) => {
  let post = req.body;
  // console.log(post, "post");

  post.user = req.user._id;
  post.postDate = new Date().toLocaleString();
  PostModel.createPost(post)
    .then((response) => {
      // console.log(response, "res o inserting post");
      return PostModel.getPostById(response._id);
    })
    .then((post) => {
      res
        .status(StatusCodes.CREATED)
        .json({ message: "posting successfully", post });
    })
    .catch((e) => console.log(e, "at inserting post"));
});

/*------------------ Edit post --------------------*/
postsRouter.put("/edit-post/:postID", authenticate, (req, res) => {
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

/*------------------ Like post --------------------*/
postsRouter.put("/like-post/:postID", authenticate, (req, res) => {
  let postID = req.params.postID;
  let userID = req.user._id;

  PostModel.updateLikeList(postID, userID).then((response) => {
    // console.log("response like list", { ...response });
    if (response.listUserLike.includes(userID)) {
      response._doc.isReacted = true;
      res.status(StatusCodes.OK).json({
        message: "reaction is successfully",
        posts: response,
      });
    } else {
      response._doc.isReacted = false;
      res.status(StatusCodes.OK).json({
        message: "reaction is successfully",
        posts: response,
      });
    }
  });
});

/*------------------ Delete post --------------------*/
postsRouter.delete("/delete-post/:postID", authenticate, (req, res) => {
  let postID = req.params.postID;

  PostModel.deletePost(postID)
    .then((response) => {
      // console.log(response, "delete post");
      res
        .status(StatusCodes.OK)
        .json({ message: "delete post successfully", postDeleted: response });
    })
    .catch((err) => {
      console.log(err, "error deleting post");
    });
});

module.exports = postsRouter;
