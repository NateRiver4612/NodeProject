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

async function lastUpdate(email, date) {
  return await User.updateOne(
    {
      email: email,
    },
    { last_update: date }
  );
}

async function updateUnnormalSignIn(email, times) {
  return await User.updateOne(
    {
      email: email,
    },
    { unnormal_signIn: times }
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
  updateResetToken,
  updateUnnormalSignIn,
};
