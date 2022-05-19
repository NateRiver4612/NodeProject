const express = require("express");
const User = require("../../mongos/user.mongo");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const RechargeValidation = require("../../validations/services/recharge.validation");
const WithDrawValidation = require("../../validations/services/withdraw.validation");
const TransferValidation = require("../../validations/services/transfer.validation");

const { AddRecharge } = require("../../models/recharge.models");
const { AddWithdraw } = require("../../models/withdraw.model");
const { AddTransfer } = require("../../models/transfer.model");
const { AddMobile, GetMobile } = require("../../models/mobile.model");

const UserService = express.Router();
const transporter = require("../../../libs/mail_transporter");

const {
  lastUpdate,
  withdrawMoney,
  rechargeMoney,
  getUser,
  receiveMoney,
} = require("../../models/user.model");

//Trình bày thông tin nạp tiền
UserService.get("/recharge", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  return res.render("confirm/recharge_confirm", {
    style: "../../../css/style.css",
    data: user,
    type: "Nạp tiền",
  });
});

//Nạp tiền vào tài khoản
UserService.post("/recharge", RechargeValidation, async (req, res) => {
  var { money, card_number } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, fullname, account_balance } = await getUser(
    current_user["username"]
  );

  //Process money
  money = parseInt(money.replace(".", "")) * 1000;

  //Thêm giao dịch
  await AddRecharge(money, username, fullname, "success", card_number);

  //Cộng tiền vào tải khoản người dùng
  await rechargeMoney(username, money);
  await lastUpdate(username, moment().format("MMMM Do YYYY, h:mm:ss a"));

  req.session.message = {
    type: "success",
    message: "Nạp tiền vào tài khoản thành công",
    intro: "Nạp tiền thành công",
  };
  console.log(req.session.message);

  return res.redirect("/user/profile");
});

//Trình bày thông tin rút tiền
UserService.get("/withdraw", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));

  const user = await getUser(current_user["username"]);

  return res.render("confirm/withdraw_confirm", {
    style: "../../../css/style.css",
    data: user,
    type: "Rút tiền",
  });
});

//Rút tiền về thẻ tín dụng
UserService.post("/withdraw", WithDrawValidation, async (req, res) => {
  var { money, card_number, note } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, fullname, account_balance } = await getUser(
    current_user["username"]
  );

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
    fullname,
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

  await lastUpdate(username, moment().format("MMMM Do YYYY, h:mm:ss a"));
  return res.redirect("/user/profile");
});

//Trình bày thông tin chuyển tiền
UserService.get("/transfer", async (req, res) => {
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
      style: "../../../css/style.css",
      data: user,
      type: "Chuyển tiền",
      message,
    });
  });
});

//Chuyển tiền qua tài khoản
UserService.post("/transfer", TransferValidation, async (req, res) => {
  var { money, receiver_phone, pay_side, note } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, fullname, account_balance } = await getUser(
    current_user["username"]
  );

  var receiver = await User.findOne({ phone_number: receiver_phone });

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
    fullname,
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
  console.log(numberWithCommas(receiver.account_balance));

  receiver = await User.findOne({ phone_number: receiver_phone });

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

  await lastUpdate(username, moment().format("MMMM Do YYYY, h:mm:ss a"));
  await lastUpdate(
    receiver.username,
    moment().format("MMMM Do YYYY, h:mm:ss a")
  );
  return res.redirect("/user/profile");
});

//Nạp tiền điện thoại
UserService.get("/mobile", async (req, res) => {});

function makecode() {
  var result = "";
  var characters = "123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Nạp tiền điện thoại
UserService.post("/mobile", async (req, res) => {
  var { network, price, quantity } = req.body;
  const current_user = JSON.parse(localStorage.getItem("user"));
  const { username, fullname } = await getUser(current_user["username"]);

  var mobile_number;
  var network_number;

  if (network == "viettel") {
    network_number = "11111";
    mobile_number = network_number + makecode();
  } else if (network == "mobifone") {
    network_number = "22222";
    mobile_number = network_number + makecode();
  } else {
    network_number = "33333";
    mobile_number = network_number + makecode();
  }

  //Tạo phí giao dịch
  const transaction_fee = 0;

  //Process money
  price = parseInt(price) * 1000;
  const total = price * parseInt(quantity);

  //Lưu giao dịch
  await AddMobile(
    network,
    network_number,
    price,
    mobile_number,
    quantity,
    transaction_fee,
    total,
    username,
    fullname,
    "success"
  );

  //Trừ tiền tài khoản người dùng
  await withdrawMoney(username, total, transaction_fee);
  await lastUpdate(username, moment().format("MMMM Do YYYY, h:mm:ss a"));

  //Lấy thông tin giao dịch
  const data = await GetMobile(mobile_number);

  return res.render("detail/mobile_detail", {
    style: "../../../css/style.css",
    data,
    fullname,
  });
});

module.exports = UserService;
