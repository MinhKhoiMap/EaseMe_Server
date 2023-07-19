const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const CommentModelClass = require("../DAL/models/commentModel");
const authenticate = require("../middlewares/authenticate");

const commentsRoute = Router();
const CommentModel = new CommentModelClass();

/*------------------ Get comment belong to id post --------------------*/
commentsRoute.get("/:postId", (req, res) => {
  let postId = req.params.postId;

  CommentModel.getComments(postId)
    .then((comments) => {
      res.status(StatusCodes.OK).json({ comments });
    })
    .catch((err) => console.log(err, "err at get comments"));
});

/*------------------ Create comment on post --------------------*/
commentsRoute.post("/create-comment/post/:post", authenticate, (req, res) => {
  if (req.user.role === "clients") {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You are not allowed to comment" });
  } else {
    let id_post = req.params.post;
    let comment = req.body.content;
    let id_psychologist = req.user._id;

    // console.log(req.body);

    CommentModel.createComment(id_post, id_psychologist, comment)
      .then((response) => {
        console.log(response, "comment created");
        res
          .status(StatusCodes.OK)
          .json({ message: "Comment created successfully" });
      })
      .catch((err) => console.log(err, "error creating comment"));
  }
});

/*------------------ Delete comment --------------------*/
commentsRoute.delete("/delete-comment/:commentID", authenticate, (req, res) => {
  let commentID = req.params.commentID;
  let userID = req.user._id;

  CommentModel.deleteComment(commentID, userID)
    .then((response) => {
      console.log(response, "Comment deleted");
      res
        .status(StatusCodes.OK)
        .json({ message: "Comment deleted successfully" });
    })
    .catch((err) => {
      console.log(err, "error deleting comment");
    });
});

module.exports = commentsRoute;
