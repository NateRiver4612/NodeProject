const User = require("../mongos/user.mongo");
const moment = require("moment");

async function saveUser(user) {
  await User.findOneAndUpdate(
    {
      email: user.email,
      phone_number: user.phone_number,
    },
    user,
    {
      upsert: true,
    }
  );
}

async function withdrawMoney(username, money, transaction_fee) {
  const { account_balance } = await User.findOne({ username: username });
  const updateMoney = account_balance - money - parseInt(transaction_fee);

  await User.updateOne(
    { username: username },
    { account_balance: updateMoney }
  );
}

async function receiveMoney(username, money, transaction_fee) {
  const { account_balance } = await User.findOne({ username: username });
  console.log(account_balance, money, transaction_fee);
  const updateMoney = account_balance + money - parseInt(transaction_fee);

  await User.updateOne(
    { username: username },
    { account_balance: updateMoney }
  );
}

async function rechargeMoney(username, money) {
  const { account_balance } = await User.findOne({ username: username });
  updateMoney = money + account_balance;
  await User.updateOne(
    { username: username },
    { account_balance: updateMoney }
  );
}

async function updateResetToken(email, token) {
  await User.updateOne({ email: email }, { reset_token: token });
}

async function setUserSignIn(user, username, password) {
  await User.updateOne(
    {
      email: user.email,
    },
    {
      username: username,
      password: password,
    }
  );
}

async function getUser(username) {
  return await User.findOne({ username: username }).lean();
}

async function changeUserPassword(email, password) {
  return await User.updateOne(
    {
      email: email,
    },
    { password: password }
  );
}

async function lastUpdate(username) {
  return await User.updateOne(
    {
      username: username,
    },
    { last_update: moment().format("MMMM Do YYYY, h:mm:ss a") }
  );
}

async function updateLocked(username, locked) {
  return await User.updateOne(
    {
      username: username,
    },
    {
      locked: locked,
    }
  );
}

async function updateWrongPassword(username, times) {
  return await User.updateOne(
    {
      username: username,
    },
    {
      wrong_password_signIn: times,
    }
  );
}

async function updateFirstSignIn(username) {
  return await User.updateOne(
    {
      username: username,
    },
    { firstSignIn: false }
  );
}

async function updateBothSideCMND(username, font_photoPath, back_photoPath) {
  return await User.findOneAndUpdate(
    {
      username: username,
    },
    {
      font_photoPath: font_photoPath,
      back_photoPath: back_photoPath,
    }
  );
}

async function updateStatus(username, status) {
  return await User.updateOne(
    {
      username: username,
    },
    {
      status: status,
    }
  );
}

module.exports = {
  saveUser,
  setUserSignIn,
  getUser,
  changeUserPassword,
  updateStatus,
  lastUpdate,
  updateFirstSignIn,
  updateResetToken,
  updateWrongPassword,
  updateLocked,
  updateBothSideCMND,
  rechargeMoney,
  withdrawMoney,
  receiveMoney,
};
