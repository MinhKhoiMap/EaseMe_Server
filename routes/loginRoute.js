const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UserModelClass = require("../DAL/models/usersModel");

const loginRoute = Router();
const UserModel = new UserModelClass();

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
