const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  secure: false, // true for 465, false for other ports
  auth: {
    user: "nguyenchinhan502@gmail.com", // generated ethereal user
    pass: "4612302001", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
