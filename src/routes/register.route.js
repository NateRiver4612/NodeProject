const express = require("express");
require("dotenv").config();
const RegisterRouter = express.Router();
const { saveUser } = require("../models/user.model");
const RegisterValidation = require("../validations/register.validation");

const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const dataDir = path.join(__dirname, "..", "data");
const vacationPhotoDir = path.join(dataDir, "CMND");

fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

RegisterRouter.get("/", (req, res) => {
  res.render("register", { style: "registerPageStyle.css" });
});

RegisterRouter.post("/", RegisterValidation, async (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      req.session.flash = {
        type: "danger",
        intro: "Opps",
        message:
          "There was an error processing your submission. Please try again.",
      };
      return res.redirect(303, "/register");
    }
    // console.log(files);
    // console.log(fields);
    let newUser = fields;

    // await saveUser(newUser);

    req.session.message = {
      type: "success",
      message: "Register successfully",
      intro: "Registration Success",
    };
    console.log(req.session.message);

    // var photo = files.photo;
    // var dir = vacationPhotoDir + "/" + Date.now();
    // var path = dir + "/" + photo.originalFilename;

    // fs.mkdirSync(dir);
    // fs.renameSync(photo.filepath, path);

    // req.session.message = {
    //   type: "success",
    //   intro: "Good luck",
    //   message: "You have been entered into the contest",
    // };
  });

  return res.redirect("/register");
});

module.exports = RegisterRouter;
