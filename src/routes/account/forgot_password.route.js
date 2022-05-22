const express = require("express");
const User = require("../../mongos/user.mongo");
const ForgotPasswordRouter = express.Router();
const transporter = require("../../../libs/mail_transporter");
const { updateResetToken } = require("../../models/user.model");
const jwt = require("jsonwebtoken");

ForgotPasswordRouter.get("/", (req, res) => {
  res.render("forgot-password", { style: "style.css" });
});

ForgotPasswordRouter.post("/", (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      req.session.flash = {
        type: "danger",
        message: "Địa chỉ gmail không tồn tại",
        intro: "Reset password failed ",
      };
      console.log(req.session.flash);
      return res.redirect("/forgot-password");
    }

    const token = jwt.sign({ _id: user._id }, "accountactivatekey123", {
      expiresIn: "1m",
    });

    const output = `
      <h1>Bạn có 1 phút trước khi token hết hạn</h1>
      <h2>Giữ token an toàn và sử dụng cho yêu cầu dưới link bên dưới</h2>
      <p>Token: ${token}</p>
      <p>Link: http://localhost:8000/reset-password</p>
    `;

    let mailOptions = {
      from: "sinhvien@phongdaotao.com ", // sender address
      to: req.body.email, // list of receivers
      subject: "Reset password", // Subject line
      text: "Làm theo yêu cầu", // plain text body
      html: output, // html body
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.json({ error: error });
      }
      await updateResetToken(email, token);

      req.session.message = {
        type: "success",
        message:
          "Hướng dẫn các bước thực hiện đã được gửi qua email người dùng",
        intro: "Email sent",
      };
      console.log(req.session.message);
      return res.redirect("/forgot-password");
    });
  });
});

module.exports = ForgotPasswordRouter;
