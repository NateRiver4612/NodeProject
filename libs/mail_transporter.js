const nodemailer = require("nodemailer");

const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const CLIENT_ID =
  "431679885294-arf4gk2tj6c9tamib36jabq0mbc838tt.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

// const REFRESH_TOKEN =
//   "1//04YPs9dKBNuPsCgYIARAAGAQSNwF-L9IrsRINs9dqHv5jUw4X-9ipursYxJZrqLMiUbfKBlPLeEkMlFxYoCCCEHOpCtXNP5dg9ss";

const REFRESH_TOKEN =
  "1//04xNlJt7ARv4aCgYIARAAGAQSNwF-L9IruigLBQiVgyA6fs4X2dzKoT6594rp7yx2DjJPcR1AHdaN8XEt4K2SUNRhyRdQxWFPB3s";

// const REFRESH_TOKEN =
//   "1//04E1sM5Jd-qJTCgYIARAAGAQSNwF-L9IrBwfB6OvM6z7yDXuMN8T0pvNARNLNSFGtfsYgFopCMnv-SNfA54rMgwAAo-JjNeqbtz8";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
  refresh_token_expires_in: 17280000000,
});

const accessToken = oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "nguyenchinhan502@gmail.com",
    clientId: CLIENT_ID,
    access_type: "offline",
    clientSecret: CLEINT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

module.exports = transporter;
