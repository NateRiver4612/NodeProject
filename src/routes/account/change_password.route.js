const express = require("express");
require("dotenv").config();
const RegisterValidation = require("../../validations/password.validation");
const app = express();
const {
  changeUserPassword,
  updateFirstSignIn,
  lastUpdate,
  getUser,
} = require("../../models/user.model");

app.use(require("cookie-parser")("secret"));
app.use(require("express-session")({ cookie: { maxAge: null } }));

const ChangePassRouter = express.Router();

ChangePassRouter.get("/", (req, res) => {
  const user = localStorage.getItem("user");
  const { firstSignIn } = JSON.parse(user);
  res.render("change_password", { style: "loginPageStyle.css", firstSignIn });
});
ChangePassRouter.post("/", RegisterValidation, async (req, res) => {
  const user = localStorage.getItem("user");
  const { email, username } = JSON.parse(user);
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
  res.redirect("/login");
});

module.exports = ChangePassRouter;
