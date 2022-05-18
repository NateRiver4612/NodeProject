const Recharge = require("../mongos/recharge.mongo");
const moment = require("moment");

async function AddRecharge(money, username, phone_number, status, card_number) {
  await Recharge.findOneAndUpdate(
    {
      username: username,
      date: moment().format("MMM Do YYYY"),
      time: moment().format("h:mm:ss a"),
    },
    {
      total: parseInt(money) * 1000,
      username: username,
      date: Date.now(),
      card_number: card_number,
      status: status,
      time: moment().format("h:mm:ss a"),
    },
    { upsert: true }
  );
}

module.exports = { AddRecharge };
