const mongoose = require("mongoose");
const moment = require("moment");

const WithdrawSchema = new mongoose.Schema({
  type: { type: String, default: "Rút tiền" },
  total: Number,
  date: { type: Date, default: Date.now() },
  time: {
    type: String,
    default: moment().format("h:mm a"),
  },
  note: { type: String, default: "" },
  transaction_fee: Number,
  username: String,
  status: { type: String, default: "success" },
  card_number: String,
  phone_number: String,
});

module.exports = mongoose.model("Withdraw", WithdrawSchema);
