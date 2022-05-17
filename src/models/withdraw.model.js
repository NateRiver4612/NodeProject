const Withdraw = require("../mongos/withdraw.mongo");
const moment = require("moment");

async function AddWithdraw(
  money,
  username,
  phone_number,
  status,
  transaction_fee,
  card_number,
  note
) {
  await Withdraw.findOneAndUpdate(
    {
      username: username,
      phone_number: phone_number,
      date: Date.now(),
      time: moment().format("h:mm a"),
    },
    {
      total: money,
      username: username,
      phone_number: phone_number,
      date: Date.now(),
      status: status,
      card_number: card_number,
      note: { type: String, default: "" },
      time: moment().format("h:mm a"),
      transaction_fee: transaction_fee,
      note: note,
    },
    { upsert: true }
  );
}

module.exports = { AddWithdraw };
