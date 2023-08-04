const UserModelClass = require("../DAL/models/usersModel");

const UserModel = new UserModelClass();

const handlePrivacyAccount = async (post) => {
  const chainHandle = new Promise((resolve, reject) => {
    const { user } = post;
    const userDoc = user._doc;
    if (String(userDoc.role).toLowerCase() !== "psychologists")
      resolve(userDoc._id);
    else reject(userDoc);
  });

  console.log("first chain");

  await chainHandle
    .then((id_user) => {
      console.log("mid chain");
      UserModel.getUserById(id_user).then((user) => {
        console.log("handle mid chain");
        post.user = user;
      });
    })
    .catch((userDoc) => {
      const { details, ...userInfo } = userDoc;
      post.user = userInfo;
    });
  console.log(post, "get user posts");
};

const handlePrivacyPost = (post) => {
  const { user } = post;
  if (String(user.role).toLowerCase() !== "psychologists") {
    const { name, avatar_url, ...userInfo } = user._doc;
    post.user = userInfo;
  }
  return post;
};

module.exports = { handlePrivacyAccount, handlePrivacyPost };
