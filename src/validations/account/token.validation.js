const jwt = require("jsonwebtoken");

async function TokenValidation(req, res, next) {
  const { token } = req.body;
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
      next();
    });
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

module.exports = TokenValidation;
