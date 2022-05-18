const {
  getUser,
  updateWrongPassword,
  updateLocked,
} = require("../../models/user.model");
const User = require("../../mongos/user.mongo");

async function LoginValidation(req, res, next) {
  const { username, password } = req.body;
  const user = await getUser(username);
  if (user) {
    const { firstSignIn, locked } = user;
    //Handle if account is locked
    if (locked) {
      req.session.message = {
        type: "danger",
        message: `Account has been locked  due to security reason, contact the admin for support`,
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

        req.session.message = {
          type: "danger",
          message: `Account has been locked due to security reason, contact the admin for support`,
          intro: "Login failed ",
        };

        console.log(req.session.message);
        return res.redirect("/login");
      } else if (wrong_password_signIn < 3) {
        req.session.flash = {
          type: "danger",
          message: `You have ${3 - wrong_password_signIn} times to try`,
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
        message:
          "This is the first time sign in you must change your password!",
        intro: "Require",
      };
      console.log(req.session.message);

      localStorage.setItem("user", JSON.stringify(user));

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
    return res.redirect("/login");
  }
}

module.exports = LoginValidation;
