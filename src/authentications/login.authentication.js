const { getUser } = require("../models/user.model");

async function LoginAuthentication(req, res, next) {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const user = await getUser(current_user ? current_user.username : "");

  if (user && user.firstSignIn == true) {
    //This is the first time user sign in
    req.session.message = {
      type: "warning",
      message: "Lần đầu tiên đăng nhập, người dùng bắt buộc đổi mật khẩu",
      intro: "Require",
    };
    console.log(req.session.message);
    return res.redirect("/user/change_password");
  }
  if (user && user.role == "user") {
    next();
  } else {
    localStorage.clear();
    return res.redirect("/login");
  }
}

module.exports = LoginAuthentication;
