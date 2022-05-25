const Card = require("../../mongos/card.mongo");

async function RechargeValidation(req, res, next) {
  const { card_number, expired, cvv, money } = req.body;

  //Check card_number
  const check_card_number = await Card.findOne({ card_number: card_number });
  if (check_card_number == null) {
    req.session.message = {
      type: "danger",
      message: "thẻ này không được hỗ trợ.",
      intro: "Nạp tiền tài khoản thất bại ",
    };
    console.log(req.session.message);
    return res.redirect("/user/home");
  } else {
    //Check expired date
    console.log(expired);
    const check_expired = await Card.findOne({
      expired: expired,
    });
    console.log(expired);

    if (check_expired == null) {
      req.session.message = {
        type: "danger",
        message: "Ngày hết hạn không hợp lệ.",
        intro: "Nạp tiền tài khoản thất bại ",
      };
      console.log(req.session.message);
      return res.redirect("/user/home");
    } else {
      //Check cvv code
      const check_cvv = await Card.findOne({
        cvv: cvv,
      });
      if (check_cvv == null) {
        req.session.message = {
          type: "danger",
          message: "Mã CVV không hơp lệ.",
          intro: "Nạp tiền tài khoản thất bại ",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      } else {
        //Check card_note
        if (parseInt(money) > 1000 && card_number == "222222") {
          req.session.message = {
            type: "danger",
            message: "Thẻ này chỉ được nạp tối đa 1 triệu/lần.",
            intro: "Nạp tiền tài khoản thất bại ",
          };
          console.log(req.session.message);
          return res.redirect("/user/home");
        }

        if (card_number == "333333") {
          req.session.message = {
            type: "danger",
            message: "Thẻ hết tiền",
            intro: "Nạp tiền tài khoản thất bại ",
          };
          console.log(req.session.message);
          return res.redirect("/user/home");
        }

        money = parseInt(money.replaceAll(".", ""));
        console.log(money);

        if (money % 50000 != 0) {
          req.session.message = {
            type: "danger",
            message: "Số tiền nạp phải là bội số của 50",
            intro: "Nạp tiền thất bại ",
          };
          console.log(req.session.message);
          return res.redirect("/user/home");
        }

        next();
      }
    }
  }
}

module.exports = RechargeValidation;
