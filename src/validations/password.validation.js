async function PasswordValidation(req, res, next) {
  const { new_pass_1, new_pass_2 } = req.body;
  if (new_pass_1 != new_pass_2) {
    req.session.flash = {
      type: "danger",
      message: "Confirm your password correctly!",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/change_password");
  } else if (new_pass_1.length < 6 || new_pass_2.length < 6) {
    req.session.flash = {
      type: "danger",
      message: "Password have at least 6 characters",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/change_password");
  } else {
    return next();
  }
}

module.exports = PasswordValidation;
