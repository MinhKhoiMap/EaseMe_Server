const mongoose = require("mongoose");
const userSchema = require("../schemas/users/userSchema");
const clientSchema = require("../schemas/users/clientSchema");
const psychologistSchema = require("../schemas/users/psychologistSchema");

class UserModelClass {
  constructor() {
    this.model = new mongoose.model("users", userSchema);
    this.client = new mongoose.model("clients", clientSchema);
    this.psychologist = new mongoose.model("psychologists", psychologistSchema);
  }

  getUserById(id_user) {
    return this.model
      .findById(id_user, "-username -password")
      .populate({ path: "details", select: "-_id -__v" });
  }

  getUsername(username) {
    return this.model.find({ username });
  }

  createRole(role) {
    if (role === "clients") {
      return this.client
        .create({ privacy_mode: "private" })
        .then((response) => response)
        .catch((err) => console.log(err, "error at create role"));
    }
    return this.psychologist
      .create({ star_number: 0 })
      .then((response) => response)
      .catch((err) => console.log(err, "error at create role"));
  }

  async createUser(userProfile) {
    await this.createRole(userProfile.role)
      .then((response) => {
        console.log(response, "ehehe");
        userProfile.details = response._id;
      })
      .catch((err) => {
        console.log("error at create user", err);
      });

    return this.model.create(userProfile);
  }

  updateUserProfile(userID, profile) {
    // console.log(userID, profile);
    return this.model
      .findByIdAndUpdate(
        userID,
        { ...profile },
        {
          overwrite: false,
          returnDocument: "after",
          select: "-username -password",
        }
      )
      .populate("details", "-_id -__v");
  }

  deleteUser(id_user) {
    return this.model.findByIdAndDelete(id_user);
  }
}

module.exports = UserModelClass;
