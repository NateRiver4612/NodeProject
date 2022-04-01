const EmailValidator = require("email-deep-validator");
const emailValidator = new EmailValidator();
const User = require("../mongos/user.mongo");
const formidable = require("formidable");

async function isEmailUserExist(email) {
  return await User.findOne({
    email: email,
  });
}

async function isEmailValid(email) {
  console.log(email);
  const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(
    email
  );
  console.log(wellFormed, validDomain, validMailbox);
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

async function RegisterValidation(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const { email, phone_number } = fields;
    if ((await isEmailValid(email)) === false) {
      req.session.message = {
        type: "danger",
        message: "Email address is not valid",
        intro: "Registration failed",
      };

      console.log(req.session.message);
      return res.redirect(303, "/register");
    } else if (isVietnamesePhoneNumber(phone_number) === false) {
      req.session.message = {
        type: "danger",
        message: "Phone number is not valid or not in VietNam",
        intro: "Registration failed",
      };

      console.log(req.session.message);
      return res.redirect(303, "/register");
    } else if (await isEmailUserExist(email)) {
      req.session.message = {
        type: "danger",
        message: "User with this email is already exists",
        intro: "Registration failed",
      };

      console.log(req.session.message);
      return res.redirect(303, "/register");
    } else if (await isPhoneNumberUserExist(phone_number)) {
      req.session.message = {
        type: "danger",
        message: "User with this phone number is already exists",
        intro: "Registration failed",
      };

      console.log(req.session.message);
      return res.redirect(303, "/register");
    }

    next();
  });
}

module.exports = RegisterValidation;
