const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UserModelClass = require("../DAL/models/usersModel");
const authenticate = require("../middlewares/authenticate");

const loginRoute = Router();
const UserModel = new UserModelClass();

loginRoute.get("/token", authenticate, (req, res) => {
  let user_id = req.user._id;
  UserModel.getUserById(user_id)
    .then((user) => {
      res
        .status(StatusCodes.OK)
        .json({ user, message: "Authentication successful" });
    })
    .catch((err) => console.log(err, "error at login with token"));
});

loginRoute.post("", (req, res) => {
  let { username, password } = req.body;

  UserModel.getUsername(username)
    .then((user) => {
      console.log(user, "at login route");
      if (user[0].password === password) {
        const token = jwt.sign(
          { id_user: user[0]._id },
          process.env.SECRET_KEY
        );

        console.log(token);

        res
          .status(StatusCodes.OK)
          .json({ user_profile: user, access_token: token });
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid password or username" });
      }
    })
    .catch((err) => {
      console.log("error at login route", err);
      res.status(StatusCodes.BAD_GATEWAY).json({ message: "Error at login" });
    });
});

module.exports = loginRoute;
