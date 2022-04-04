async function PasswordValidation(req, res, next) {
  const { new_pass_1, new_pass_2, old_pass } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  if (old_pass && old_pass != current_user.password) {
    req.session.flash = {
      type: "danger",
      message: "Current password is not exists!",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/user/change_password");
  } else if (new_pass_1 != new_pass_2) {
    req.session.flash = {
      type: "danger",
      message: "Confirm your password correctly!",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/user/change_password");
  } else if (new_pass_1.length < 6 || new_pass_2.length < 6) {
    req.session.flash = {
      type: "danger",
      message: "Password have at least 6 characters",
      intro: "Change password failed",
    };
    console.log(req.session.flash);
    return res.redirect("/user/change_password");
  }
  // else if (old_pass == new_pass_2) {
  //   req.session.flash = {
  //     type: "danger",
  //     message: "",
  //     intro: "Change password failed",
  //   };
  //   console.log(req.session.flash);
  //   return res.redirect("/user/change_password");
  // }
  else {
    return next();
  }
}

module.exports = PasswordValidation;
