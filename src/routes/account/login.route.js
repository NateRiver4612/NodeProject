const express = require("express");
const LoginRouter = express.Router();
const LoginValidation = require("../../validations/login.validation");
const LoginAuthentication = require("../../authentications/login.authentication");
const { getUser } = require("../../models/user.model");
const { updateWrongPassword } = require("../../models/user.model");

LoginRouter.get("/", (req, res) => {
  res.render("login", { style: "loginPageStyle.css" });
});
LoginRouter.post("/", LoginValidation, async (req, res) => {
  const { username } = req.body;
  const user = await getUser(username);

  await updateWrongPassword(user.email, 0);

  //Set current_user
  localStorage.setItem("user", JSON.stringify(user));
  console.log(
    "set current_user when login",
    JSON.parse(localStorage.getItem("user"))["username"]
  );

  return res.redirect("/user");
});

module.exports = LoginRouter;
