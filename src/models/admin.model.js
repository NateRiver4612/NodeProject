const User = require("../mongos/user.mongo");
const Withdraw = require("../mongos/withdraw.mongo");

async function getAccounts(status) {
  return await User.find({ status: status }).lean();
}

async function getWithdraws() {
  return await Withdraw.find({ status: "pending" }).lean();
}

async function createAdmin() {
  return await User.findOneAndUpdate(
    {
      username: "admin",
      password: "123456",
      role: "admin",
      status: "",
    },
    {},
    { upsert: true }
  );
}

async function getAccount(id) {
  return await User.findOne({ _id: id }).lean();
}

async function getWithdraw(id) {
  return await Withdraw.findOne({ _id: id }).lean();
}

module.exports = {
  getAccounts,
  getWithdraws,
  getWithdraw,
  createAdmin,
  getAccount,
};
