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

async function updateLocked(email, locked) {
  return await User.updateOne(
    {
      email: email,
    },
    {
      locked: locked,
    }
  );
}

async function updateWrongPassword(email, times) {
  return await User.updateOne(
    {
      email: email,
    },
    {
      wrong_password_signIn: times,
    }
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

async function updateBothSideCMND(current_user) {
  return await User.updateOne(
    {
      email: current_user.email,
    },
    {
      font_photoPath: current_user.update_font_photoPath,
      back_photoPath: current_user.update_back_photoPath,
    }
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
  updateWrongPassword,
  updateLocked,
  updateBothSideCMND,
};
