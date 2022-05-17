const Recharge = require("../mongos/recharge.mongo");
const moment = require("moment");

async function AddRecharge(money, username, phone_number, status, card_number) {
  await Recharge.findOneAndUpdate(
    {
      username: username,
      phone_number: phone_number,
      date: Date.now(),
      time: moment().format("h:mm a"),
    },
    {
      total: parseInt(money) * 1000,
      username: username,
      phone_number: phone_number,
      date: Date.now(),
      card_number: card_number,
      status: status,
      time: moment().format("h:mm a"),
    },
    { upsert: true }
  );
}

module.exports = { AddRecharge };
