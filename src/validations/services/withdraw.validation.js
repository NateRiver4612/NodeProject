const Card = require("../../mongos/card.mongo");

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
        money = parseInt(money.replace(".", ""));
        console.log(money);
        if (money % 50000 != 0) {
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

module.exports = WithDrawValidation;
