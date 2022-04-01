const express = require("express");
require("dotenv").config();
const app = express();
const User = require("../mongos/user.mongo");
app.use(require("cookie-parser")("secret"));
app.use(require("express-session")({ cookie: { maxAge: null } }));

const LoginRouter = express.Router();

LoginRouter.get("/", (req, res) => {
  res.render("login", { style: "loginPageStyle.css" });
});
LoginRouter.post("/", (req, res) => {
  User.findOne(
    { username: req.body.username, password: req.body.password },
    (err, user) => {
      if (!err && user) {
        //..thanh cong
        console.log("Success");
        req.session.userName = req.body.username;
        req.session.userPassword = req.body.password;
        return res.redirect("/users");
      } else {
        //that bai:
        res.render("login", {
          username: req.body.username,
          message: "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
    }
  );
});

module.exports = LoginRouter;
