const express = require("express");
const { getWithdraws, getWithdraw } = require("../../models/admin.model");
const {
  withdrawMoney,
  lastUpdate,
  getUser,
} = require("../../models/user.model");
const transporter = require("../../../libs/mail_transporter");

const Withdraw = require("../../mongos/withdraw.mongo");
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
  await lastUpdate();

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
    to: user.email, // list of receivers
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

module.exports = ServicesRoute;
