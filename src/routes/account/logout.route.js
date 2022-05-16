const express = require("express");
const LogoutRouter = express.Router();

LogoutRouter.get("/", (req, res) => {
  //Clear current_user
  localStorage.clear();
  console.log("Clear current_user", localStorage.getItem("user"));

  res.redirect("/");
});

module.exports = LogoutRouter;
