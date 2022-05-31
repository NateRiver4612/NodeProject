const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function ResetPassValidation(req, res, next) {
  const { new_pass_1, new_pass_2, token } = req.body;

  if (token) {
    jwt.verify(token, "accountactivatekey123", (err, decodedData) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message:
            "Token của bạn đã hết hạn hoặc không hợp lệ, vui lòng thực hiện lại thao tác",
          intro: "Reset password failed ",
        };
        console.log(req.session.message);
        return res.redirect("/forgot-password");
      }
    });

    if (new_pass_1 != new_pass_2) {
      req.session.flash = {
        type: "danger",
        message: "Xác minh mật khẩu không chính xác!",
        intro: "Change password failed",
      };
      console.log(req.session.flash);
      return res.redirect("/reset-password");
    } else if (new_pass_1.length < 6 || new_pass_2.length < 6) {
      req.session.flash = {
        type: "danger",
        message: "Mật khẩu phải ít nhất 6 kí tự",
        intro: "Change password failed",
      };
      console.log(req.session.flash);
      return res.redirect("/reset-password");
    } else {
      return next();
    }
  } else {
    req.session.flash = {
      type: "danger",
      message: "Token không được để trống",
      intro: "Reset password failed ",
    };
    console.log(req.session.flash);
    return res.redirect("/reset-password");
  }
}

module.exports = ResetPassValidation;
