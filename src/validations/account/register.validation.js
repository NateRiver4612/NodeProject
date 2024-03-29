const EmailValidator = require("email-deep-validator");
const emailValidator = new EmailValidator();
const User = require("../../mongos/user.mongo");
const formidable = require("formidable");

async function isEmailUserExist(email) {
  return await User.findOne({
    email: email,
  });
}

async function isEmailValid(email) {
  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
    email
  );
  return wellFormed && validDomain && validMailbox;
}

async function isPhoneNumberUserExist(phone_number) {
  return await User.findOne({
    phone_number: phone_number,
  });
}

function isVietnamesePhoneNumber(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

async function RegisterValidation(err, req, fields) {
  const { email, phone_number } = fields;
  if (err) {
    req.session.message = {
      type: "danger",
      message: "Error occur during process",
      intro: "Registration failed",
    };
    console.log(req.session.message);
    return false;
  }

  if ((await isEmailValid(email)) === false) {
    req.session.message = {
      type: "danger",
      message: "Địa chỉ email không hợp lệ",
      intro: "Registration failed",
    };

    console.log(req.session.message);
    return false;
  } else if (isVietnamesePhoneNumber(phone_number) === false) {
    req.session.message = {
      type: "danger",
      message: "Số điện thoại không hợp lệ",
      intro: "Registration failed",
    };
    console.log(req.session.message);
    return false;
  } else if (await isEmailUserExist(email)) {
    req.session.message = {
      type: "danger",
      message: "Email đã được sử dụng để đăng ký",
      intro: "Registration failed",
    };

    console.log(req.session.message);
    return false;
  } else if (await isPhoneNumberUserExist(phone_number)) {
    req.session.message = {
      type: "danger",
      message: "Số điện thoại đã được sử dụng",
      intro: "Registration failed",
    };

    console.log(req.session.message);
    return false;
  } else {
    return true;
  }
}

module.exports = RegisterValidation;
