const express = require("express");
require("dotenv").config();
const { getUser } = require("../../models/user.model");
const app = express();
app.use(require("cookie-parser")("secret"));
app.use(require("express-session")({ cookie: { maxAge: null } }));

const LoginRouter = express.Router();

LoginRouter.get("/", (req, res) => {
  res.render("login", { style: "loginPageStyle.css" });
});
LoginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser(username, password);
  if (user) {
    const { firstSignIn } = user;
    localStorage.setItem("user", JSON.stringify(user));
    if (firstSignIn) {
      //This is the first time user sign in
      req.session.message = {
        type: "warning",
        message:
          "This is the first time sign in you must change your password!",
        intro: "Require: ",
      };
      console.log(req.session.message);
      res.redirect("/change_password");
    } else {
      //This is NOT the first time user sign in
      return res.redirect("/user");
    }
  } else {
    req.session.flash = {
      type: "danger",
      message: "Username or password is incorrect",
      intro: "Login failed ",
    };
    console.log(req.session.flash);
    res.redirect("/login");
  }
});

module.exports = LoginRouter;
