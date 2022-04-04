const { getUser, updateUnnormalSignIn } = require("../models/user.model");

async function LoginValidation(req, res, next) {
  const { username, password } = req.body;
  const user = await getUser(username);
  if (user) {
    const { firstSignIn } = user;
    if (password != user.password) {
      const unnormal_signIn = user.unnormal_signIn + 1;
      await updateUnnormalSignIn(user.email, unnormal_signIn);

      if (unnormal_signIn < 3) {
        req.session.flash = {
          type: "danger",
          message: `You have ${3 - unnormal_signIn} times to try`,
          intro: "Login failed ",
        };
      } else {
        req.session.flash = {
          type: "danger",
          message: `You have enter wrong password 3 times`,
          intro: "Login failed ",
        };
      }
      console.log(req.session.flash);
      return res.redirect("/login");
    }

    if (firstSignIn) {
      //This is the first time user sign in
      req.session.message = {
        type: "warning",
        message:
          "This is the first time sign in you must change your password!",
        intro: "Require: ",
      };
      console.log(req.session.message);
      return res.redirect("/user/change_password");
    } else {
      //This is NOT the first time user sign in
      next();
    }
  } else {
    req.session.flash = {
      type: "danger",
      message: "Username is not exists",
      intro: "Login failed ",
    };
    console.log(req.session.flash);
    res.redirect("/login");
  }
}

module.exports = LoginValidation;
