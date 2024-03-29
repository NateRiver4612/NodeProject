const jwt = require("jsonwebtoken");
const User = require("../../mongos/user.mongo");

async function TransferValidation(req, res, next) {
  var { token, receiver_phone, money } = req.body;

  //Validate token
  if (token) {
    jwt.verify(token, "accountactivatekey123", async (err, decodedData) => {
      if (err) {
        req.session.message = {
          type: "danger",
          message:
            "Token không hợp lệ hoặc đã hết hạn.Thực hiện giao dịch lại để nhận token mới",
          intro: "Chuyển tiền thất bại",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      }
      //Validate receiver phone number
      const receiver = await User.findOne({ phone_number: receiver_phone });

      if (receiver == null) {
        req.session.message = {
          type: "danger",
          message: "Số điện thoại người nhận không tồn tại",
          intro: "Chuyển tiền thất bại ",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      }

      const current_user_phone_number = JSON.parse(
        localStorage.getItem("user")
      )["phone_number"];

      if (receiver_phone == current_user_phone_number) {
        req.session.message = {
          type: "danger",
          message: "Số điện thoại người nhận trùng với người gửi",
          intro: "Chuyển tiền thất bại ",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      }

      money = parseInt(money.replaceAll(".", ""));
      console.log(money);
      if (money % 50000 != 0) {
        req.session.message = {
          type: "danger",
          message: "Số tiền chuyển phải là bội số của 50",
          intro: "Chuyển tiền qua tài khoản thất bại ",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      }
      next();
    });
  } else {
    req.session.flash = {
      type: "danger",
      message: "Token không được để trống",
      intro: "Reset password failed ",
    };
    console.log(req.session.flash);
    return res.redirect("/user/home");
  }
}

module.exports = TransferValidation;
