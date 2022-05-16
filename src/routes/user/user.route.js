const express = require("express");
const PasswordValidation = require("../../validations/password.validation");
const CardValidation = require("../../validations/card.validation");
const path = require("path");
const User = require("../../mongos/user.mongo");
const formidable = require("formidable");

const fs = require("fs");

const dataDir = path.join(__dirname, "..", "..", "..", "public", "images");
const CMNDPhotoDir = path.join(dataDir, "CMND");

const UserRouter = express.Router();
const {
  changeUserPassword,
  updateFirstSignIn,
  lastUpdate,
  addMoney,
  getUser,
} = require("../../models/user.model");

UserRouter.get("/", (req, res) => {
  return res.redirect("/user/home");
});

//User home route
UserRouter.get("/home", (req, res) => {
  return res.render("user_home", {
    style: "../../css/homePageStyle.css",
  });
});

//Get user for the client
UserRouter.get("/info", (req, res) => {
  try {
    return res.status(200).json(JSON.parse(localStorage.getItem("user")));
  } catch (error) {
    console.log("Error get user-info for client", error.toString);
  }
});

UserRouter.get("/profile", (req, res) => {
  const user = JSON.parse(localStorage.getItem("user"));
  user.birthdate = user.birthdate.split("T")[0];
  user.font_photoPath = user.font_photoPath.split("public\\")[1];
  user.back_photoPath = user.back_photoPath.split("public\\")[1];

  return res.render("profile", {
    style: "../../css/profilePageStyle.css",
    data: user,
  });
});

UserRouter.post("/profile", async (req, res) => {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async function (err, fields, files = []) {
    const current_user = JSON.parse(localStorage.getItem("user"));
    Object.keys(files).map((key) => {
      const photo = files[key];

      const extension = photo["originalFilename"]
        .toString()
        .split(".")
        .slice(-1)[0];

      var dir = CMNDPhotoDir + "/" + current_user.email;
      var Path = dir + "/" + key + "." + extension;

      current_user[key] = Path;

      fs.existsSync(dir) || fs.mkdirSync(dir);
      fs.renameSync(photo.filepath, Path);
    });
    localStorage.setItem("user", JSON.stringify(current_user));
    return res.redirect("/user/profile");
  });
});

UserRouter.get("/change_password", (req, res) => {
  const current_user = localStorage.getItem("user");
  const { firstSignIn } = JSON.parse(current_user);
  return res.render("change_password", {
    style: "../../css/loginPageStyle.css",
    firstSignIn,
  });
});

UserRouter.post("/change_password", PasswordValidation, async (req, res) => {
  const current_user = localStorage.getItem("user");
  const { email, username } = JSON.parse(current_user);
  const { new_pass_2 } = req.body;

  await changeUserPassword(email, new_pass_2);
  await lastUpdate(email, Date.now());
  await updateFirstSignIn(email);

  const newUser = await getUser(username, new_pass_2);
  localStorage.setItem("user", JSON.stringify(newUser));

  console.log(JSON.parse(localStorage.getItem("user")));

  req.session.message = {
    type: "success",
    message: "You have change your password succesfully",
    intro: "Change password succesfully",
  };
  console.log(req.session.message);
  return res.redirect("/login");
});

UserRouter.post("/add_money", CardValidation, async (req, res) => {
  const { money } = req.body;
  const { email, username } = JSON.parse(localStorage.getItem("user"));

  await addMoney(email, money);
  req.session.message = {
    type: "success",
    message: "Nạp tiền vào tài khoản thành công",
    intro: "Nạp tiền thành công",
  };

  const new_user = await getUser(username);

  //Update current_user
  localStorage.setItem("user", JSON.stringify(new_user));

  console.log(req.session.message);
  return res.redirect("/user/home");
});

module.exports = UserRouter;
