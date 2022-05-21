const { getUser } = require("../../models/user.model");

async function StatusValidation(req, res, next) {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const user = await getUser(current_user["username"]);

  if (user.status != "activated") {
    req.session.message = {
      type: "danger",
      message:
        "Tài khoản còn đang trong giao đoạn chờ kích hoạt hoặc đã bị từ chối",
      intro: "Không thể thực hiện dịch vụ",
    };
    console.log(req.session.flash);
    return res.redirect("/user/home");
  }
  next();
}

module.exports = StatusValidation;
