const express = require("express");
const AccountsRoute = require("./account.route");

const AdminRouter = express.Router();

AdminRouter.get("/", (req, res) => {
  return res.render("admin/admin_home", {
    layout: "admin",
    style: "./adminPageStyle.css",
  });
});

AdminRouter.get("/logout", (req, res) => {
  localStorage.clear();
  console.log("Clear current_user", localStorage.getItem("user"));

  return res.redirect("/");
});

AdminRouter.use("/accounts", AccountsRoute);

module.exports = AdminRouter;
