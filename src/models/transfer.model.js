const Transfer = require("../mongos/transfer.mongo");
const moment = require("moment");

async function AddTransfer(
  money,
  username,
  status,
  transaction_fee,
  note,
  receiver_username,
  receiver_fullname,
  pay_side
) {
  await Transfer.findOneAndUpdate(
    {
      username: username,
      receiver_username: receiver_username,
      date: Date.now(),
      time: moment().format("h:mm a"),
    },
    {
      total: money,
      username: username,
      date: Date.now(),
      status: status,
      note: { type: String, default: "" },
      time: moment().format("h:mm a"),
      transaction_fee: transaction_fee,
      note: note,
      receiver_username: receiver_username,
      receiver_fullname: receiver_fullname,
      pay_side: pay_side,
    },
    { upsert: true }
  );
}

module.exports = { AddTransfer };
