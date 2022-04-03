const User = require("../mongos/user.mongo");

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

async function getUser(username, password) {
  return await User.findOne({ username: username, password: password }).lean();
}

async function changeUserPassword(email, password) {
  return await User.updateOne(
    {
      email: email,
    },
    { password: password }
  );
}

async function lastUpdate(email, date) {
  return await User.updateOne(
    {
      email: email,
    },
    { last_update: date }
  );
}

async function updateFirstSignIn(email) {
  return await User.updateOne(
    {
      email: email,
    },
    { firstSignIn: false }
  );
}

module.exports = {
  saveUser,
  setUserSignIn,
  getUser,
  changeUserPassword,
  lastUpdate,
  updateFirstSignIn,
};
