const {
  getUser,
  updateWrongPassword,
  updateLocked,
  updateStatus,
  lastUpdate,
} = require("../../models/user.model");
const User = require("../../mongos/user.mongo");

async function LoginValidation(req, res, next) {
  const { username, password } = req.body;
  const user = await getUser(username);

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
    }

    //handle type wrong password
    if (password != user.password && user.role == "user") {
      const wrong_password_signIn = user.wrong_password_signIn + 1;
      await updateWrongPassword(user.email, wrong_password_signIn);

      if (wrong_password_signIn >= 3) {
        await updateLocked(user.email, true);
        await lastUpdate();
        await updateStatus(username, "locked");
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

    //handle firstSignIn
    if (firstSignIn) {
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
      //This is NOT the first time user sign in
      next();
    }
  } else if (user.role == "admin") {
    next();
  } else {
    req.session.flash = {
      type: "danger",
      message: "Tài khoản không tồn tái",
      intro: "Login failed ",
    };
    console.log(req.session.flash);
    return res.redirect("/login");
  }
}

module.exports = LoginValidation;
