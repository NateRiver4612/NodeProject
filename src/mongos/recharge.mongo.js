const mongoose = require("mongoose");
const moment = require("moment");

const RechargeSchema = new mongoose.Schema({
  type: { type: String, default: "Nạp tiền vào tài khoản" },
  total: { type: Number, default: 0 },
  date: { type: String, default: moment().format("MMM Do YYYY") },
  card_number: String,
  time: {
    type: String,
    default: moment().format("h:mm:ss a"),
  },
  username: String,
  status: { type: String, default: "pending" },
  phone_number: String,
});

module.exports = mongoose.model("Recharge", RechargeSchema);
