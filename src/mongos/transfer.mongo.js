const mongoose = require("mongoose");
const moment = require("moment");

const TransferSchema = new mongoose.Schema({
  type: { type: String, default: "Chuyển tiền cùng hệ thống" },
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
  receiver_fullname: String,
  receiver_username: String,
  pay_side: String,
});

module.exports = mongoose.model("Transfer", TransferSchema);
