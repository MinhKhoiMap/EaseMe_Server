const { StatusCodes } = require("http-status-codes");
const UserModelClass = require("../DAL/models/usersModel");

async function checkingUser(req, res, next) {
  const userModel = new UserModelClass();
  if (req.body.password === req.body.confpassword) {
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
  } else {
    res
      .status(StatusCodes.NON_AUTHORITATIVE_INFORMATION)
      .json({ message: "Your information is incorrect" });
  }
}

module.exports = checkingUser;
