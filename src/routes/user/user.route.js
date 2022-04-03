const express = require("express");

const app = express();
const path = require("path");
const User = require("../../mongos/user.mongo");

const UserRouter = express.Router();

UserRouter.get("/", (req, res) => {
  const user = JSON.parse(localStorage.getItem("user"));
  user.birthdate = user.birthdate.split("T")[0];
  user.font_photoPath = user.font_photoPath.split("public\\")[1];
  user.back_photoPath = user.back_photoPath.split("public\\")[1];

  res.render("profile", {
    style: "profilePageStyle.css",
    data: user,
  });
});

UserRouter.post("/", async (req, res, next) => {});

module.exports = UserRouter;
