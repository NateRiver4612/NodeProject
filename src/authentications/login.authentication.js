function LoginAuthentication(req, res, next) {
  const current_user = JSON.parse(localStorage.getItem("user"));
  if (current_user) {
    next();
  } else {
    return res.redirect("/login");
  }
}

module.exports = LoginAuthentication;
