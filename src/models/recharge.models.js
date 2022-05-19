const Recharge = require("../mongos/recharge.mongo");
const moment = require("moment");

async function AddRecharge(money, username, fullname, status, card_number) {
  await Recharge.findOneAndUpdate(
    {
      username: username,
      date: moment().format("MMM Do YYYY"),
      time: moment().format("h:mm:ss a"),
    },
    {
      total: money,
      username: username,
      date: moment().format("MMM Do YYYY"),
      card_number: card_number,
      status: status,
      fullname: fullname,
      time: moment().format("h:mm:ss a"),
    },
    { upsert: true }
  );
}

async function GetListRecharge() {
  return Recharge.find({}).lean();
}

module.exports = { AddRecharge, GetListRecharge };
