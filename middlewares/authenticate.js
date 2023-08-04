const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const UserModelClass = require("../DAL/models/usersModel");

const secretKey = process.env.SECRET_KEY;
const UserModel = new UserModelClass();

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = jwt.verify(authorization, secretKey);

    // console.log(token, "authorization");

    UserModel.getUserById(token.id_user)
      .then((response) => {
        // console.log(response, "authenticated");
        if (response._id.toString() === token.id_user) {
          req.user = response;
          next();
        } else {
          res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Invalid account" });
        }
      })
      .catch((err) => {
        console.log("err authenticating", err);
        res.status(StatusCodes.GATEWAY_TIMEOUT).json({ message: err.message });
      });
  } catch (err) {
    console.log("error authenticating middleware", err);
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err });
  }
};

module.exports = authenticate;
