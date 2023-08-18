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
const metadataUpload = { contentType: "image/webp" };

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
usersRoute.post(
  "/create-user",
  checkingUser,
  uploadHandler.any(),
  async (req, res) => {
    const imageFiles = req.files;
    console.log(imageFiles, "image files");
    let userProfile, fullImageRef, croppedImageRef;
    let profile = req.body;
    profile.join_date = new Date().toLocaleDateString();
    profile.role = "clients";

    await UserModel.createUser(profile)
      .then((response) => {
        console.log("resone create user", response);
        userProfile = response;
        if (imageFiles && imageFiles.length > 0) {
          fullImageRef = ref(
            firebaseStorage,
            `upload/users/${response._id}/avatar/full_image`
          );
          croppedImageRef = ref(
            firebaseStorage,
            `upload/users/${response._id}/avatar/cropped_image`
          );
        } else {
          res.status(StatusCodes.OK).json({ profile: response });
        }
      })
      .catch((err) => {
        console.log(err, "Error creating user");
        res
          .status(StatusCodes.BAD_GATEWAY)
          .json({ message: `Error is ${err.message}` });
      });

    await uploadBytes(fullImageRef, imageFiles[0].buffer, metadataUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        userProfile.full_image_path = downloadURL;
      })
      .then(() =>
        uploadBytes(croppedImageRef, imageFiles[1].buffer, metadataUpload)
      )
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        userProfile.cropped_image_path = downloadURL;
      });

    UserModel.updateUserProfile(userProfile._id, {
      avatar_url: userProfile.cropped_image_path,
      avatar_full_url: userProfile.full_image_path,
    })
      .then((response) => {
        res.status(StatusCodes.OK).json({ profile: response });
      })
      .catch((err) => {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: `Error is ${err.message}` });
      });
  }
);

/*------------------ Update user profile --------------------*/
usersRoute.put("/update-profile", authenticate, (req, res) => {
  let userID = req.user._id;
  let profile = req.body;

  // console.log(profile, "profile");

  UserModel.updateUserProfile(userID, profile)
    .then((response) => {
      // console.log(response, "profile updated");

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

    const result = {}; // an object result with cropped image and full image

    // Upload images to the firebase server
    await uploadBytes(fullImageRef, imageFiles[0].buffer, metadataUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        result.full_image_path = downloadURL;
      })
      .then(() =>
        uploadBytes(croppedImageRef, imageFiles[1].buffer, metadataUpload)
      )
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        result.cropped_image_path = downloadURL;
      });

    // Update Image URL to database
    UserModel.updateUserProfile(userID, {
      [`${field}_url`]: result.cropped_image_path,
      [`${field}_full_url`]: result.full_image_path,
    }).then((response) => {
      res.status(StatusCodes.OK).json({ profile: response });
    });
  }
);

/*------------------ Delete User --------------------*/
usersRoute.delete("/delete-user", authenticate, (req, res) => {
  let id_user = req.user._id;

  UserModel.deleteUser(id_user)
    .then((response) => {
      // console.log(response, "delete user successfully");
      res.status(StatusCodes.OK).json({ message: "deleted user successfully" });
    })
    .catch((err) => {
      console.log(err, "Error deleting user");
    });
});

module.exports = usersRoute;
