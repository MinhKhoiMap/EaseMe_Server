const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const getUserIDFromToken = (token) => {
  try {
    return jwt.verify(token, secretKey).id_user;
  } catch (err) {
    return err;
  }
};

module.exports = { getUserIDFromToken };
