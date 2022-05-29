const User = require("../mongos/user.mongo");
const Withdraw = require("../mongos/withdraw.mongo");
const Transfer = require("../mongos/transfer.mongo");

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
      firstSignIn: false,
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

async function getTransfers() {
  return await Transfer.find({ status: "pending" }).lean();
}

async function getTransfer(id) {
  return await Transfer.findOne({ _id: id }).lean();
}

module.exports = {
  getAccounts,
  getWithdraws,
  getWithdraw,
  getTransfers,
  getTransfer,
  createAdmin,
  getAccount,
};
