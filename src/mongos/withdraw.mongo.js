const mongoose = require("mongoose");
const moment = require("moment");

const WithdrawSchema = new mongoose.Schema({
  type: { type: String, default: "Rút tiền về thẻ" },
  total: Number,
  date: { type: String, default: moment().format("MMM Do YYYY") },
  time: {
    type: String,
    default: moment().format("h:mm:ss a"),
  },
  note: { type: String, default: "" },
  transaction_fee: Number,
  username: String,
  status: { type: String, default: "success" },
  card_number: String,
  phone_number: String,
});

module.exports = mongoose.model("Withdraw", WithdrawSchema);
