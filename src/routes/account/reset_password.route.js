const express = require("express");
const ResetPasswordRouter = express.Router();
const TokenValidation = require("../../validations/account/token.validation");
const PasswordValidation = require("../../validations/account/password.validation");
const User = require("../../mongos/user.mongo");
const { changeUserPassword } = require("../../models/user.model");

ResetPasswordRouter.get("/", (req, res) => {
  res.render("reset-password", {
    token: req.params.id,
    style: "loginPageStyle.css",
  });
});

ResetPasswordRouter.post(
  "/",
  TokenValidation,
  PasswordValidation,
  (req, res) => {
    const { token, new_pass_2 } = req.body;
    console.log("Make it");
    console.log(req.body);
    User.findOne({ reset_token: token }, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "User email is not exists" });
      }
      await changeUserPassword(user.email, new_pass_2);
      req.session.message = {
        type: "success",
        message: "You have reset your password succesfully",
        intro: "Reset password succesfully",
      };
      res.redirect("/login");
    });
  }
);

module.exports = ResetPasswordRouter;
