const express = require("express");
const ResetPasswordRouter = express.Router();
// const TokenValidation = require("../../validations/account/token.validation");
// const PasswordValidation = require("../../validations/account/password.validation");
const ResetPassValidation = require("../../validations/account/reset_pass.validation");
const User = require("../../mongos/user.mongo");
const { changeUserPassword } = require("../../models/user.model");
const saltRounds = 10;
const bcrypt = require("bcrypt");

ResetPasswordRouter.get("/", (req, res) => {
  res.render("reset-password", {
    token: req.params.id,
    style: "style.css",
  });
});

ResetPasswordRouter.post("/", ResetPassValidation, (req, res) => {
  const { token, new_pass_2 } = req.body;
  console.log("Make it");
  console.log(req.body);
  User.findOne({ reset_token: token }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User email is not exists" });
    }
    bcrypt.hash(new_pass_2, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      await changeUserPassword(user.email, hash);
    });
    req.session.message = {
      type: "success",
      message: "Tài khoản đã được reset mật khẩu thành công",
      intro: "Reset password succesfully",
    };
    res.redirect("/login");
  });
});

module.exports = ResetPasswordRouter;
