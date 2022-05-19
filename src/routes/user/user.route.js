const express = require("express");
const PasswordValidation = require("../../validations/account/password.validation");
const moment = require("moment");

const path = require("path");
const formidable = require("formidable");

const fs = require("fs");
const dataDir = path.join(__dirname, "..", "..", "..", "public", "images");
const CMNDPhotoDir = path.join(dataDir, "CMND");

const UserRouter = express.Router();
const {
  changeUserPassword,
  updateFirstSignIn,
  lastUpdate,
  getUser,
} = require("../../models/user.model");

const UserService = require("./services.route");
const ServiceHistory = require("./history.route");

UserRouter.get("/", (req, res) => {
  return res.redirect("/user/home");
});

//User home route
UserRouter.get("/home", (req, res) => {
  return res.render("user_home", {
    style: "../../css/style.css",
  });
});

//Get user for the client
UserRouter.get("/info", async (req, res) => {
  try {
    const current_user = JSON.parse(localStorage.getItem("user"));
    const user = await getUser(current_user["username"]);
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error get user-info for client", error.toString);
  }
});

//Trả về thông tin người dùng
UserRouter.get("/profile", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  user.birthdate = user.birthdate.toString().split(" ").splice(1, 3).join("-");
  user.font_photoPath = user.font_photoPath.split("public\\")[1];
  user.back_photoPath = user.back_photoPath.split("public\\")[1];

  return res.render("profile", {
    style: "../../css/style.css",
    data: user,
  });
});

//Cập nhật thông tin người dùng
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
    await lastUpdate(
      current_user["username"],
      moment().format("MMMM Do YYYY, h:mm:ss a")
    );

    return res.redirect("/user/profile");
  });
});

//Đổi mật khẩu
UserRouter.get("/change_password", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const { firstSignIn } = await getUser(current_user["username"]);

  return res.render("change_password", {
    style: "../../css/style.css",
    firstSignIn,
  });
});

//Đổi mật khẩu
UserRouter.post("/change_password", PasswordValidation, async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const { email, username } = await getUser(current_user["username"]);

  const { new_pass_2 } = req.body;

  await changeUserPassword(email, new_pass_2);
  await lastUpdate(email, moment().format("MMMM Do YYYY, h:mm:ss a"));
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

//Cung cấp dịch vụ cho người dùng
UserRouter.use("/service", UserService);

//Thống kê giao dịch
UserRouter.use("/history", ServiceHistory);

module.exports = UserRouter;
