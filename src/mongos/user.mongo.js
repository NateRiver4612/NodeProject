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
  unnormal_signIn: { type: Number, default: 0 },
  created_date: { type: Date, default: Date.now() },
  last_update: { type: Date },
  locked_time: { type: Number, default: 0 },
  firstSignIn: { type: Boolean, default: true },
  username: { type: String, require, default: "" },
  password: { type: String, require, default: "" },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", UserSchema);
