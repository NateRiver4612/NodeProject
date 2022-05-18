const express = require("express");
const PasswordValidation = require("../../validations/account/password.validation");
const RechargeValidation = require("../../validations/services/recharge.validation");
const WithDrawValidation = require("../../validations/services/withdraw.validation");
const TransferValidation = require("../../validations/services/transfer.validation");
const jwt = require("jsonwebtoken");

const User = require("../../mongos/user.mongo");

const transporter = require("../../../libs/mail_transporter");
const path = require("path");
const formidable = require("formidable");

const fs = require("fs");
const dataDir = path.join(__dirname, "..", "..", "..", "public", "images");
const CMNDPhotoDir = path.join(dataDir, "CMND");

const { AddRecharge } = require("../../models/recharge.models");
const { AddWithdraw } = require("../../models/withdraw.model");
const { AddTransfer } = require("../../models/transfer.model");

const UserRouter = express.Router();
const {
  changeUserPassword,
  updateFirstSignIn,
  lastUpdate,
  withdrawMoney,
  rechargeMoney,
  getUser,
  receiveMoney,
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

//Trình bày thông tin nạp tiền
UserRouter.get("/recharge", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  return res.render("confirm/recharge_confirm", {
    style: "../../css/transactionPageStyle.css",
    data: user,
    type: "Nạp tiền",
  });
});

//Nạp tiền vào tài khoản
UserRouter.post("/recharge", RechargeValidation, async (req, res) => {
  var { money, card_number } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, phone_number, account_balance } = await getUser(
    current_user["username"]
  );

  //Process money
  money = parseInt(money.replace(".", "")) * 1000 + account_balance;

  //Thêm giao dịch
  await AddRecharge(money, username, "success", card_number);

  //Cộng tiền vào tải khoản người dùng
  await rechargeMoney(username, money);
  await lastUpdate(username, Date.now());

  req.session.message = {
    type: "success",
    message: "Nạp tiền vào tài khoản thành công",
    intro: "Nạp tiền thành công",
  };
  console.log(req.session.message);

  return res.redirect("/user/profile");
});

//Trình bày thông tin rút tiền
UserRouter.get("/withdraw", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  return res.render("confirm/withdraw_confirm", {
    style: "../../css/transactionPageStyle.css",
    data: user,
    type: "Rút tiền",
  });
});

//Rút tiền về thẻ tín dụng
UserRouter.post("/withdraw", WithDrawValidation, async (req, res) => {
  var { money, card_number, note } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, account_balance } = await getUser(current_user["username"]);

  //Process money
  money = parseInt(money.replace(".", "")) * 1000;

  //Tạo phí giao dịch
  const transaction_fee = money * (5 / 100);

  //----------------------------------------------------Duyệt bởi admin---------------------------------------

  //Kiểm tra số tiền vượt mức
  if (account_balance < money + transaction_fee) {
    req.session.message = {
      type: "danger",
      message: "Số tiền vượt mức dư tài khoản",
      intro: "Rút tiền thất bài",
    };
    console.log(req.session.message);

    return res.redirect("/user/home");
  }

  //Lưu giao dịch
  await AddWithdraw(
    money,
    username,
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
  return res.redirect("/user/profile");
});

//Trình bày thông tin chuyển tiền
UserRouter.get("/transfer", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const user = await getUser(current_user["username"]);

  const token = jwt.sign(
    { phone_number: user.phone_number },
    "accountactivatekey123",
    {
      expiresIn: "1m",
    }
  );

  const output = `
      <h1>You have 1 minute before this token is expired</h1>
      <h2>Please keep the Token secure and follow instructions</h2>
      <p>Token: ${token}</p>
    `;

  let mailOptions = {
    from: "admin@gmail.com", // sender address
    to: user.email, // list of receivers
    subject: "Confirm your transaction", // Subject line
    text: "Follow the instruction", // plain text body
    html: output, // html body
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({ error: error });
    }

    message = {
      type: "success",
      message:
        "Use Token we have sent you through gmail to confirm your transaction, you have 1 minute",
      intro: "Email sent",
    };

    return res.render("confirm/transfer_confirm", {
      style: "../../css/transactionPageStyle.css",
      data: user,
      type: "Chuyển tiền",
      message,
    });
  });
});

//Chuyển tiền qua tài khoản
UserRouter.post("/transfer", TransferValidation, async (req, res) => {
  var { money, receiver_phone, pay_side, note } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, fullname, account_balance } = await getUser(
    current_user["username"]
  );

  const receiver = await User.findOne({ phone_number: receiver_phone });

  //Process money
  money = parseInt(money.replace(".", "")) * 1000;

  //Tạo phí giao dịch
  const transaction_fee = money * (5 / 100);

  //Kiểm tra số tiền vượt mức
  if (account_balance < money) {
    req.session.message = {
      type: "danger",
      message: "Số tiền vượt mức dư tài khoản",
      intro: "Chuyển thất bài",
    };
    console.log(req.session.message);
    return res.redirect("/user/home");
  }

  //Lưu giao dịch
  await AddTransfer(
    money,
    username,
    "success",
    transaction_fee,
    note,
    receiver.username,
    receiver.fullname,
    pay_side
  );

  var sender_fee = 0;
  var receiver_fee = 0;

  if (pay_side == "Người chuyển") {
    sender_fee = transaction_fee;
  } else {
    receiver_fee = transaction_fee;
    if (receiver.account_balance < receiver_fee) {
      req.session.message = {
        type: "danger",
        message: "Số dư tài khoản người nhận không đủ để trả phí",
        intro: "Chuyển tiền thất bài",
      };
      console.log(req.session.message);
      return res.redirect("/user/home");
    }
  }

  //Trừ tiền tài khoản người gửi
  await withdrawMoney(username, money, sender_fee);

  //Cộng tiền tài khoản người nhận
  await receiveMoney(receiver.username, money, receiver_fee);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const output = `
      <h1>Thông báo nhận tiền</h1>
      <h2>Tài khoản được chuyển thêm: ${numberWithCommas(money)} VND</h2>
      <h2>Số dư hiện tại ${numberWithCommas(receiver.account_balance)} VND</h2>
      <h3>Thông tin người gửi </h3>
      <h4>Tài khoản: ${username}</h4>
      <h4>Chủ tài khoản: ${fullname}</h4>
    `;

  let mailOptions = {
    from: "admin@gmail.com", // sender address
    to: receiver.email, // list of receivers
    subject: "New transaction", // Subject line
    text: "View the transaction detail", // plain text body
    html: output, // html body
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({ error: error });
    }
  });

  req.session.message = {
    type: "success",
    message: `Chuyển tiền qua tài khoản ${receiver.username} thành công`,
    intro: "Chuyển tiền thành công",
  };
  console.log(req.session.message);

  await lastUpdate(username, Date.now());
  await lastUpdate(receiver.username, Date.now());
  return res.redirect("/user/profile");
});

module.exports = UserRouter;
