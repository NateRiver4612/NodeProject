const express = require("express");
const LoginRouter = express.Router();
const LoginValidation = require("../../validations/login.validation");
const { getUser } = require("../../models/user.model");
const { updateUnnormalSignIn } = require("../../models/user.model");

LoginRouter.get("/", (req, res) => {
  res.render("login", { style: "loginPageStyle.css" });
});
LoginRouter.post("/", LoginValidation, async (req, res) => {
  const { username } = req.body;
  const user = await getUser(username);
  await updateUnnormalSignIn(user.email, 0);
  localStorage.setItem("user", JSON.stringify(user));
  return res.redirect("/user");
});

module.exports = LoginRouter;
