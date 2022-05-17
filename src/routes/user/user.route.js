const express = require("express");
const PasswordValidation = require("../../validations/password.validation");
const {
  AddMoneyValidation,
  WithDrawValidation,
} = require("../../validations/card.validation");
const path = require("path");
const User = require("../../mongos/user.mongo");
const formidable = require("formidable");

const Recharge = require("../../mongos/recharge.mongo");

const fs = require("fs");
const moment = require("moment");
const dataDir = path.join(__dirname, "..", "..", "..", "public", "images");
const CMNDPhotoDir = path.join(dataDir, "CMND");

const { AddRecharge } = require("../../models/recharge.models");
const { AddWithdraw } = require("../../models/withdraw.model");

const UserRouter = express.Router();
const {
  changeUserPassword,
  updateFirstSignIn,
  lastUpdate,
  withdrawMoney,
  addMoney,
  getUser,
} = require("../../models/user.model");

UserRouter.get("/", (req, res) => {
  return res.redirect("/user/home");
});

//User home route
UserRouter.get("/home", (req, res) => {
  return res.render("user_home", {
    style: "../../css/homePageStyle.css",
  });
});

//Get user for the client
UserRouter.get("/info", async (req, res) => {
  try {
    const current_user = JSON.parse(localStorage.getItem("user"));
    const user = await getUser(current_user["username"]);
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error get user-info for client", error.toString);
  }
});

//Trả về thông tin người dùng
UserRouter.get("/profile", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  user.birthdate = user.birthdate.toString().split(" ").splice(1, 3).join("-");
  user.font_photoPath = user.font_photoPath.split("public\\")[1];
  user.back_photoPath = user.back_photoPath.split("public\\")[1];

  return res.render("profile", {
    style: "../../css/profilePageStyle.css",
    data: user,
  });
});

//Cập nhật thông tin người dùng
UserRouter.post("/profile", async (req, res) => {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async function (err, fields, files = []) {
    const current_user = JSON.parse(localStorage.getItem("user"));
    Object.keys(files).map((key) => {
      const photo = files[key];

      const extension = photo["originalFilename"]
        .toString()
        .split(".")
        .slice(-1)[0];

      var dir = CMNDPhotoDir + "/" + current_user.email;
      var Path = dir + "/" + key + "." + extension;

      current_user[key] = Path;

      fs.existsSync(dir) || fs.mkdirSync(dir);
      fs.renameSync(photo.filepath, Path);
    });
    localStorage.setItem("user", JSON.stringify(current_user));
    await lastUpdate(current_user["username"], Date.now());

    return res.redirect("/user/profile");
  });
});

//Đổi mật khẩu
UserRouter.get("/change_password", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const { firstSignIn } = await getUser(current_user["username"]);

  return res.render("change_password", {
    style: "../../css/loginPageStyle.css",
    firstSignIn,
  });
});

//Đổi mật khẩu
UserRouter.post("/change_password", PasswordValidation, async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const { email, username } = await getUser(current_user["username"]);

  const { new_pass_2 } = req.body;

  await changeUserPassword(email, new_pass_2);
  await lastUpdate(email, Date.now());
  await updateFirstSignIn(email);

  const newUser = await getUser(username, new_pass_2);
  localStorage.setItem("user", JSON.stringify(newUser));

  console.log(JSON.parse(localStorage.getItem("user")));

  req.session.message = {
    type: "success",
    message: "You have change your password succesfully",
    intro: "Change password succesfully",
  };
  console.log(req.session.message);
  return res.redirect("/login");
});

//Nạp tiền vào tài khoản
UserRouter.post("/add_money", AddMoneyValidation, async (req, res) => {
  const { money } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));

  const { username, phone_number } = await getUser(current_user["username"]);

  //Thêm giao dịch
  await AddRecharge(money, username, phone_number, "success");

  //Cộng tiền vào tải khoản người dùng
  await addMoney(username, money);

  req.session.message = {
    type: "success",
    message: "Nạp tiền vào tài khoản thành công",
    intro: "Nạp tiền thành công",
  };
  console.log(req.session.message);

  await lastUpdate(username, Date.now());
  return res.redirect("/user/home");
});

//Rút tiền về thẻ tín dụng
UserRouter.post("/withdraw", WithDrawValidation, async (req, res) => {
  const { money, card_number, note } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, phone_number, account_balance } = await getUser(
    current_user["username"]
  );

  //----------------------------------------------------Duyệt bởi admin---------------------------------------

  //Kiểm tra số tiền vượt mức
  if (account_balance < parseInt(money) * 1000) {
    req.session.message = {
      type: "danger",
      message: "Số tiền vượt mức dư tài khoản",
      intro: "Rút tiền thất bài",
    };
    console.log(req.session.message);

    await lastUpdate(username, Date.now());
    return res.redirect("/user/home");
  }

  //Tạo phí giao dịch
  const transaction_fee = money * (5 / 100) * 1000;

  //Thêm giao dịch
  await AddWithdraw(
    money,
    username,
    phone_number,
    "success",
    transaction_fee,
    card_number,
    note
  );

  //Rút tiền người dùng
  await withdrawMoney(username, money, transaction_fee);

  req.session.message = {
    type: "success",
    message: "Rút tiền về ví thành công",
    intro: "Rút tiền thành công",
  };
  console.log(req.session.message);

  await lastUpdate(username, Date.now());
  return res.redirect("/user/home");
});

module.exports = UserRouter;
