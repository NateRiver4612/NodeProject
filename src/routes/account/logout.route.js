const express = require("express");
const LogoutRouter = express.Router();

LogoutRouter.get("/", (req, res) => {
  localStorage.clear();
  res.redirect("/");
});

module.exports = LogoutRouter;
