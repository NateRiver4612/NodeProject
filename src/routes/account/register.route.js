const express = require("express");
require("dotenv").config();
const RegisterRouter = express.Router();
const { saveUser, setUserSignIn } = require("../../models/user.model");
const RegisterValidation = require("../../validations/account/register.validation");
const transporter = require("../../../libs/mail_transporter");
const saltRounds = 10;

const bcrypt = require("bcrypt");

const path = require("path");
const fs = require("fs");
const dataDir = path.join(__dirname, "..", "..", "..", "public", "images");
const CMNDPhotoDir = path.join(dataDir, "CMND");

fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(CMNDPhotoDir) || fs.mkdirSync(CMNDPhotoDir);

const User = require("../../mongos/user.mongo");
const formidable = require("formidable");

RegisterRouter.get("/", (req, res) => {
  res.render("register", { style: "style.css" });
});

RegisterRouter.post("/", async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async function (err, fields, files = []) {
    if ((await RegisterValidation(err, req, fields)) == false) {
      return res.redirect(303, "/register");
    } else {
      const newUser = fields;

      Object.keys(files).map((key) => {
        const photo = files[key];

        const extension = photo["originalFilename"]
          .toString()
          .split(".")
          .slice(-1)[0];

        var dir = CMNDPhotoDir + "/" + newUser.email;
        var Path = dir + "/" + key + "." + extension;

        newUser[key] = Path;
        fs.existsSync(dir) || fs.mkdirSync(dir);
        fs.renameSync(photo.filepath, Path);
      });

      const temp_username = makeUsername();
      const temp_password = makePassword();

      const output = `
        <h2>Username: ${temp_username}</h2>
        <h2>Password: ${temp_password}</h2>
      `;

      const mailOptions = {
        from: "sinhvien@phongdaotao.com", // sender address
        to: newUser.email, // list of receivers
        subject: "Thông tin đăng nhập", // Subject line
        text: "Đây là tài khoản và mật khẩu tạm thời", // plain text body
        html: output, // html body
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return console.log(error);
        }
        await saveUser(newUser);
        await setUserSignIn(newUser, temp_username, temp_password);
        req.session.message = {
          type: "success",
          message:
            "Chúng tôi đã gửi một email bao gồm thông tin đăng nhập tạm thời cho bạn",
          intro: "Đăng ký Success",
        };
        console.log(req.session.register_message);

        return res.redirect("/login");
      });
    }
  });
});

function makeUsername() {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makePassword() {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = RegisterRouter;
