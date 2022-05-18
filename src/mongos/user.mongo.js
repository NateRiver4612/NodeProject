const mongoose = require("mongoose");
const moment = require("moment");

const UserSchema = new mongoose.Schema({
  phone_number: { type: String, require },
  email: { type: String, require },
  fullname: { type: String, require },
  birthdate: { type: Date, require },
  address: { type: String, require },
  font_photoPath: { type: String, require },
  back_photoPath: { type: String, require },
  status: { type: String, default: "Pending" },
  created_date: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
  last_update: { type: String },
  locked: { type: Boolean, default: false },
  firstSignIn: { type: Boolean, default: true },
  username: { type: String, require, default: "" },
  password: { type: String, require, default: "" },
  role: { type: String, default: "user" },
  reset_token: { type: String, default: "" },
  account_balance: { type: Number, default: 0 },
  wrong_password_signIn: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
