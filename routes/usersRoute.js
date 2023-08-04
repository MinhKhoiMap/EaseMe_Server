const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const UserModelClass = require("../DAL/models/usersModel");
const multer = require("multer");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseApp = require("../DAL/firebase.config");

/*------------------  Define middleware --------------------*/
const checkingUser = require("../middlewares/checkingAccount");
const authenticate = require("../middlewares/authenticate");

const usersRoute = Router();
const UserModel = new UserModelClass();

const uploadHandler = multer();
const firebaseStorage = getStorage(firebaseApp);

/*------------------ Get Psychologists by ID --------------------*/
usersRoute.get("/:id", (req, res) => {
  let id = req.params.id;

  UserModel.getUserById(id)
    .then((user) => {
      if (user?.role !== "clients") res.status(StatusCodes.ACCEPTED).json(user);
      else {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Request is not allowed" });
      }
    })
    .catch((err) => {
      console.log(err, "err at get user by id");
    });
});

/*------------------ Create a new user --------------------*/
usersRoute.post("/create-user", checkingUser, (req, res) => {
  let profile = req.body;
  profile.join_date = new Date().toLocaleDateString();

  UserModel.createUser(profile)
    .then((response) => {
      // console.log("resone create user", response);
      res.status(StatusCodes.OK).json({ message: "User created successfully" });
    })
    .catch((err) => console.log(err, "Error creating user"));
});

/*------------------ Update user profile --------------------*/
usersRoute.put("/update-profile", authenticate, (req, res) => {
  let userID = req.user._id;
  let profile = req.body;

  console.log(profile, "profile");

  UserModel.updateUserProfile(userID, profile)
    .then((response) => {
      console.log(response, "profile updated");

      res
        .status(StatusCodes.OK)
        .json({ profile: response, message: "updated profile successfully" });
    })
    .catch((err) => {
      console.log(err, "Error updating profile");
    });
});

usersRoute.post(
  "/upload/:field",
  authenticate,
  uploadHandler.any(),
  async (req, res) => {
    const userID = req.user._id;
    const field = req.params.field;
    const imageFiles = req.files;
    // console.log(req.files[0], req.body, "avatar file");
    let fullImageRef = ref(
      firebaseStorage,
      `upload/users/${userID}/${field}/full_image`
    );
    let croppedImageRef = ref(
      firebaseStorage,
      `upload/users/${userID}/${field}/cropped_image`
    );
    const metadata = { contentType: "image/webp" };

    const result = {}; // an object result with cropped image and full image

    // Upload images to the firebase server
    await uploadBytes(fullImageRef, imageFiles[0].buffer, metadata)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        result.full_image_path = downloadURL;
      })
      .then(() => uploadBytes(croppedImageRef, imageFiles[1].buffer, metadata))
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        result.cropped_image_path = downloadURL;
      });

    // Update Image URL to database
    UserModel.updateUserProfile(userID, {
      [`${field}_url`]: result.cropped_image_path,
      [`${field}_full_url`]: result.full_image_path,
    }).then((response) => {
      res.status(200).json({ profile: response });
    });
  }
);

/*------------------ Delete User --------------------*/
usersRoute.delete("/delete-user", authenticate, (req, res) => {
  let id_user = req.user._id;

  UserModel.deleteUser(id_user)
    .then((response) => {
      console.log(response, "delete user successfully");
      res.status(StatusCodes.OK).json({ message: "deleted user successfully" });
    })
    .catch((err) => {
      console.log(err, "Error deleting user");
    });
});

module.exports = usersRoute;
