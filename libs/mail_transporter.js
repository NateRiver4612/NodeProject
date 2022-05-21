const nodemailer = require("nodemailer");

const { google } = require("googleapis");

// These id's and secrets should come from .env file.
// const CLIENT_ID =
//   "431679885294-arf4gk2tj6c9tamib36jabq0mbc838tt.apps.googleusercontent.com";
// const CLEINT_SECRET = "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";
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN =
//   "1//04Ciht6QhIerRCgYIARAAGAQSNwF-L9Ir6RrpY7mFWR_ba78bOmBqf2aKhOj0D7H4RNTtM0JWn-_iArNTl3j1KPpz5PxeGs9kJg4";

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLEINT_SECRET,
//   REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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

// const accessToken = oAuth2Client.getAccessToken();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: "nguyenchinhan502@gmail.com",
//     clientId: CLIENT_ID,
//     clientSecret: CLEINT_SECRET,
//     refreshToken: REFRESH_TOKEN,
//     accessToken: accessToken,
//   },
// });

module.exports = transporter;
