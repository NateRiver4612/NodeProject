const User = require("../mongos/user.mongo");

async function getAccounts(status) {
  console.log(status);
  return await User.find({ status: status }).lean();
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

module.exports = {
  getAccounts,
  createAdmin,
  getAccount,
};
