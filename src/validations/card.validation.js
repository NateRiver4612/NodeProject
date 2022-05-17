const Card = require("../mongos/card.mongo");

async function AddMoneyValidation(req, res, next) {
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
        next();
      }
    }
  }
}

async function WithDrawValidation(req, res, next) {
  var { card_number, expired, cvv, money } = req.body;

  //Check card_number
  if (card_number != "111111") {
    req.session.message = {
      type: "danger",
      message: "thẻ này không được hỗ trợ.",
      intro: "Rút tiền về thẻ thất bại",
    };
    console.log(req.session.message);
    return res.redirect("/user/home");
  } else {
    //Check expired date
    if (expired != "2022-10-10") {
      req.session.message = {
        type: "danger",
        message: "Ngày hết hạn không hợp lệ.",
        intro: "Rút tiền về thẻ thất bại ",
      };
      console.log(req.session.message);
      return res.redirect("/user/home");
    } else {
      //Check cvv code
      if (cvv != "411") {
        req.session.message = {
          type: "danger",
          message: "Mã CVV không hơp lệ.",
          intro: "Rút tiền về thẻ thất bại ",
        };
        console.log(req.session.message);
        return res.redirect("/user/home");
      } else {
        money = parseInt(money.replace(".", "")) * 1000;
        if (money % 50 != 0) {
          req.session.message = {
            type: "danger",
            message: "Số tiền rút phải là bội số của 50",
            intro: "Rút tiền về thẻ thất bại ",
          };
          console.log(req.session.message);
          return res.redirect("/user/home");
        }
        next();
      }
    }
  }
}

module.exports = { AddMoneyValidation, WithDrawValidation };
