const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.phongdaotao.com",
  port: 587,
  secureConnection: false,
  auth: {
    user: "sinhvien@phongdaotao.com", // generated ethereal user
    pass: "svtdtu", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
