const jwt = require("jsonwebtoken");

async function TokenValidation(req, res, next) {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, "accountactivatekey123", (err, decodedData) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message:
            "Your token is incorrect or expired, please re-register to get new token",
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
      message: "Your token is can not be empty",
      intro: "Reset password failed ",
    };
    console.log(req.session.flash);
    return res.redirect("/reset-password");
  }
}

module.exports = TokenValidation;
