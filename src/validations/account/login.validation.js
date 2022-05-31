const {
  getUser,
  updateWrongPassword,
  updateLocked,
  updateStatus,
  lastUpdate,
} = require("../../models/user.model");
const User = require("../../mongos/user.mongo");
const bcrypt = require("bcrypt");

async function LoginValidation(req, res, next) {
  const { username, password } = req.body;
  const user = await getUser(username);
  console.log("Username", user);

  if (user && user.role == "user") {
    const { firstSignIn, locked, status } = user;
    //Handle if account is locked
    if (locked) {
      req.session.message = {
        type: "danger",
        message: `Tài khoản bị khóa do đăng nhập sai nhiều lần`,
        intro: "Login failed ",
      };
      console.log(req.session.message);
      return res.redirect("/login");
    } else if (status == "canceled") {
      req.session.message = {
        type: "danger",
        message: `Tài khoản đã bị vô hiệu quá vui lòng liên hệ tổng đài 18001080`,
        intro: "Login failed ",
      };
      console.log(req.session.message);
      return res.redirect("/login");
    } else if (firstSignIn) {
      //This is the first time user sign in
      req.session.message = {
        type: "warning",
        message: "Lần đầu tiên đăng nhập, người dùng bắt buộc đổi mật khẩu",
        intro: "Require",
      };
      console.log(req.session.message);

      localStorage.setItem("user", JSON.stringify(user));

      return res.redirect("/user/change_password");
    } else {
      //handle type wrong password
      // Load hash from your password DB.
      bcrypt.compare(password, user.password, async function (err, result) {
        if (result == false && user.role == "user" && user) {
          const wrong_password_signIn = user.wrong_password_signIn + 1;
          await updateWrongPassword(user.username, wrong_password_signIn);
          console.log(wrong_password_signIn);
          if (wrong_password_signIn >= 3) {
            await updateLocked(user.username, true);
            await lastUpdate(username);
            const { last_update } = await getUser(username);
            await updateStatus(username, `locked at ${last_update}`);
            req.session.message = {
              type: "danger",
              message: `Tài khoản bị khóa do đăng nhập sai nhiều lần`,
              intro: "Login failed ",
            };

            console.log(req.session.message);
            return res.redirect("/login");
          } else if (wrong_password_signIn < 3) {
            req.session.flash = {
              type: "danger",
              message: `Bạn còn ${3 - wrong_password_signIn} lần để thử`,
              intro: "Login failed ",
            };

            console.log(req.session.flash);
            return res.redirect("/login");
          }
        }
        next();
      });
    }
  } else if (username == "admin") {
    if (username != "admin" || password != "123456") {
      req.session.flash = {
        type: "danger",
        message: `Thông tin đăng nhập không chính xác`,
        intro: "Login failed ",
      };

      console.log(req.session.flash);
      return res.redirect("/login");
    }
    next();
  } else {
    req.session.flash = {
      type: "danger",
      message: "Tài khoản không tồn tại",
      intro: "Login failed ",
    };
    console.log(req.session.flash);
    return res.redirect("/login");
  }
}

module.exports = LoginValidation;
