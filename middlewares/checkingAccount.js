const { StatusCodes } = require("http-status-codes");
const UserModelClass = require("../DAL/models/usersModel");

async function checkingUser(req, res, next) {
  const userModel = new UserModelClass();
  // console.log("wtffff");
  await userModel
    .getUsername(req.body.username)
    .then((response) => {
      if (response.length < 1) {
        next();
      } else
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Account already exists" });
    })
    .catch((err) => console.log(err, "error at checking user"));
}

module.exports = checkingUser;
