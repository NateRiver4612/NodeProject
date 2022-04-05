const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone_number: { type: String, require },
  email: { type: String, require },
  fullname: { type: String, require },
  birthdate: { type: Date, require },
  address: { type: String, require },
  font_photoPath: { type: String, require },
  back_photoPath: { type: String, require },
  status: { type: String, default: "waiting_verify" },
  created_date: { type: Date, default: Date.now() },
  last_update: { type: Date },
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
