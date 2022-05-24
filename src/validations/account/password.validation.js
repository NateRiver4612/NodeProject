const bcrypt = require("bcrypt");

async function PasswordValidation(req, res, next) {
  const { new_pass_1, new_pass_2, old_pass } = req.body;

  const current_user = JSON.parse(localStorage.getItem("user"));

  if (current_user) {
    bcrypt.compare(old_pass, current_user.password, function (err, result) {
      if (result == false) {
        req.session.flash = {
          type: "danger",
          message: "Mật khẩu hiện tại không tồn tại!",
          intro: "Change password failed",
        };
        console.log(req.session.flash);
        return res.redirect("/user/change_password");
      }
    });
  }

  if (new_pass_1 != new_pass_2) {
    req.session.flash = {
      type: "danger",
      message: "Xác minh mật khẩu không chính xác!",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/user/change_password");
  } else if (new_pass_1.length < 6 || new_pass_2.length < 6) {
    req.session.flash = {
      type: "danger",
      message: "Mật khẩu phải ít nhất 6 kí tự",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/user/change_password");
  } else {
    return next();
  }
}

module.exports = PasswordValidation;
