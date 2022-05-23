const express = require("express");
const {
  getWithdraws,
  getTransfers,
  getWithdraw,
  getTransfer,
} = require("../../models/admin.model");
const {
  withdrawMoney,
  lastUpdate,
  getUser,
  receiveMoney,
} = require("../../models/user.model");
const transporter = require("../../../libs/mail_transporter");

const Withdraw = require("../../mongos/withdraw.mongo");
const Transfer = require("../../mongos/transfer.mongo");
const ServicesRoute = express.Router();
const User = require("../../mongos/user.mongo");

function toDate(date, time) {
  const restult = date + " " + time;
  return new Date(restult.toString().replace("st", "").replaceAll("nd", ""));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//--------------------------------------------------ROUTE FOR WITHDRAW SERVICE-----------------------------------------
ServicesRoute.get("/withdraw", async (req, res) => {
  const data = await getWithdraws();

  console.log(data);

  data.sort(function (a, b) {
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("admin/services/withdraw/service_withdraw", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

ServicesRoute.get("/withdraw/:id", async (req, res) => {
  const id = req.params.id;

  const data = await getWithdraw(id);

  return res.render("admin/services/withdraw/service_withdraw_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

ServicesRoute.post("/withdraw/:id/activate", async (req, res) => {
  const { admin_transaction_id } = req.body;
  const data = await getWithdraw(admin_transaction_id);

  //Update user transaction
  await withdrawMoney(data.username, data.total, data.transaction_fee);
  await lastUpdate(data.username);

  //Update transaction status
  await Withdraw.updateOne(
    { _id: admin_transaction_id },
    { status: "activated" }
  );

  const user = await getUser(data.username);

  const output = `
      <h1>Cập nhật giao dịch</h1>
      <h2>Admin đã duyệt giao dịch rút tiền</h2>
      <h2>Tài khoản đã rút ra: ${numberWithCommas(data.total)} VND về thẻ</h2>
      <h2>Số dư hiện tại ${numberWithCommas(user.account_balance)} VND</h2>
    `;

  let mailOptions = {
    from: "sinhvien@phongdaotao.com", // sender address
    to: user.email,
    subject: "Thông báo giao dịch", // Subject line
    text: "Xem thông tin chi tiết giao dịch", // plain text body
    html: output, // html body
  };

  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.json({ error: error });
    }
  });

  req.session.message = {
    type: "warning",
    message: "Giao dịch đã thực thi thành công",
    intro: "Đã duyệt thành công",
  };
  console.log(req.session.message);

  return res.redirect("/admin/services/withdraw");
});

ServicesRoute.get("/transfer", async (req, res) => {
  const data = await getTransfers();

  console.log(data);

  data.sort(function (a, b) {
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("admin/services/transfer/service_transfer", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

ServicesRoute.get("/transfer/:id", async (req, res) => {
  const id = req.params.id;

  const data = await getTransfer(id);

  return res.render("admin/services/transfer/service_transfer_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

ServicesRoute.post("/transfer/:id/activate", async (req, res) => {
  const { admin_transaction_id } = req.body;
  const data = await getTransfer(admin_transaction_id);

  var sender_fee = 0;
  var receiver_fee = 0;
  console.log(data.total);

  if (data.pay_side == "Người chuyển") {
    sender_fee = data.transaction_fee;
  } else {
    receiver_fee = data.transaction_fee;
  }

  //Trừ tiền người gửi
  await withdrawMoney(data.username, data.total, sender_fee);

  //Cộng tiền tài khoản người nhận
  await receiveMoney(data.receiver_username, data.total, receiver_fee);

  //Update transaction status
  await Transfer.updateOne(
    { _id: admin_transaction_id },
    { status: "activated" }
  );

  //Thực hiện gửi gmail thông báo đã duyệt cho người gửi
  const user = await getUser(data.username);

  const outputSender = `
      <h1>Cập nhật giao dịch</h1>
      <h2>Admin đã duyệt giao dịch chuyển tiền</h2>
      <h2>Tài khoản đã chuyển: ${numberWithCommas(data.total)} VND đến ${
    data.receiver_fullname
  } thành công</h2>
      <h2>Số dư hiện tại ${numberWithCommas(user.account_balance)} VND</h2>
    `;

  let mailSenderOptions = {
    from: "sinhvien@phongdaotao.com", // sender address
    to: user.email,
    subject: "Thông báo giao dịch", // Subject line
    text: "Xem thông tin chi tiết giao dịch", // plain text body
    html: outputSender, // html body
  };

  //Thực hiện gửi gmail thông báo đã nhận cho người nhận
  receiver = await User.findOne({ username: data.receiver_username });
  const outputReceiver = `
      <h1>Thông báo nhận tiền</h1>
      <h2>Tài khoản được chuyển thêm: ${numberWithCommas(data.total)} VND</h2>
      <h2>Số dư hiện tại ${numberWithCommas(receiver.account_balance)} VND</h2>
      <h3>Thông tin người gửi </h3>
      <h4>Tài khoản: ${data.username}</h4>
      <h4>Chủ tài khoản: ${data.fullname}</h4>
      <h4>Nội dung: ${data.note ? data.note : ""}</h4>
    `;

  let mailReceiverOptions = {
    from: "sinhvien@phongdaotao.com", // sender address
    to: receiver.email, // list of receivers
    subject: "Có giao dịch mới", // Subject line
    text: "Xem thông tin chi tiết giao dịch", // plain text body
    html: outputReceiver, // html body
  };

  transporter.sendMail(mailReceiverOptions, async (error, info) => {
    if (error) {
      return res.json({ error: error });
    }
  });

  transporter.sendMail(mailSenderOptions, async (error, info) => {
    if (error) {
      return res.json({ error: error });
    }
  });

  await lastUpdate(data.username);
  await lastUpdate(receiver.username);
  req.session.message = {
    type: "warning",
    message: "Giao dịch đã thực thi thành công",
    intro: "Đã duyệt thành công",
  };
  console.log(req.session.message);

  return res.redirect("/admin/services/transfer");
});

module.exports = ServicesRoute;
