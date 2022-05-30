const express = require("express");
const LoginRouter = express.Router();
const LoginValidation = require("../../validations/account/login.validation");
const { getUser, updateLocked } = require("../../models/user.model");
const { updateWrongPassword } = require("../../models/user.model");
const bcrypt = require("bcrypt");

LoginRouter.get("/", (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  if (current_user && current_user.role == "user") {
    return res.redirect("/user");
  } else if (current_user && current_user.role == "admin") {
    return res.redirect("/admin");
  }
  res.render("login", { style: "style.css" });
});
LoginRouter.post("/", LoginValidation, async (req, res) => {
  const { username } = req.body;
  const user = await getUser(username);

  if (user && user.role == "user") {
    await updateWrongPassword(user.username, 0);
    await updateLocked(user.username, false);
  }
  //Set current_user
  localStorage.setItem("user", JSON.stringify(user));
  console.log(
    "set current_user when login",
    JSON.parse(localStorage.getItem("user"))["username"]
  );
  if (user.role == "admin") {
    req.session.flash = {
      type: "success",
      message: "Đăng nhập dưới danh Admin",
      intro: "Welcome",
    };
    console.log(req.session.flash);

    return res.redirect("/admin");
  }
  return res.redirect("/user");
});

module.exports = LoginRouter;
