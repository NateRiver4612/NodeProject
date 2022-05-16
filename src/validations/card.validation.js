const Card = require("../mongos/card.mongo");

async function CardValidation(req, res, next) {
  const { card_number, expired, cvv } = req.body;

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
        next();
      }
    }
  }
}

module.exports = CardValidation;
