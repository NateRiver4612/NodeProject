const mongoose = require("mongoose");
const moment = require("moment");

const MobileSchema = new mongoose.Schema({
  network: String,
  network_number: String,
  price: Number,
  mobile_code: String,
  quantity: Number,
  transaction_fee: { type: Number, default: 0 },
  username: String,
  total: Number,
  status: String,
  date: { type: String, default: moment().format("MMM Do YYYY") },
  time: {
    type: String,
    default: moment().format("h:mm:ss a"),
  },
});

module.exports = mongoose.model("Mobile", MobileSchema);
