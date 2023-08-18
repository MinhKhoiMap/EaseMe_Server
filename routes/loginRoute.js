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
      // console.log({ user }, "at login route");
      if (user.length > 0) {
        if (user[0].password === password) {
          // console.log("vai ca lit", password);
          return UserModel.getUserById(user[0]._id);
        } else {
          // res
          //   .status(StatusCodes.UNAUTHORIZED)
          //   .json({ message: "Invalid password or username" });

          return Promise.reject({
            status: StatusCodes.UNAUTHORIZED,
            message: "Invalid password or username",
          });
        }
      } else {
        return Promise.reject({
          status: StatusCodes.NOT_FOUND,
          message: "Username doest not exist",
        });
      }
    })
    .then((userProfile) => {
      if (userProfile) {
        const token = jwt.sign(
          { id_user: userProfile._id },
          process.env.SECRET_KEY
        );
        res.status(StatusCodes.OK).json({
          message: "Login successfully",
          user_profile: userProfile,
          access_token: token,
        });
      }
    })
    .catch((err) => {
      console.log("error at login route", err);
      res.status(err.status).json({ message: err.message });
    });
});

module.exports = loginRoute;
