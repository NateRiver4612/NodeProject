const express = require("express");
const User = require("../mongos/user.mongo");
const {
  getDssv,
  deleteUserByMssv,
  addNewUser,
  getUserByMssv,
  updateUserByMssv,
} = require("../models/user.model");
const UsersRouter = express.Router();

//ValidateUser

//get list user
UsersRouter.get("/", async (req, res) => {
  const dssv = await (
    await getDssv()
  ).sort((a, b) => {
    return a.mssv - b.mssv;
  });

  if (req.session.userName && req.session.userPassword) {
    //..thanh cong
    return res.render("dssv", {
      data: dssv,
      message: req.session?.message,
    });
  } else {
    //that bai:
    return res.redirect("/");
  }
});

//add user
UsersRouter.get("/add", (req, res) => {
  res.render("add", { style: "addPageStyle.css" });
});

UsersRouter.post("/add", async (req, res) => {
  const newUser = req.body;
  try {
    await addNewUser(newUser);
    req.session.message = {
      type: "success",
      message: "Đã thêm user: " + newUser.username,
      intro: "Thêm user thành công",
    };
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Xảy ra lỗi trong quá trình thêm user",
      intro: "Thêm user thất bại",
    };
    console.log(error);
  }
  res.redirect("/");
});

//delete user
UsersRouter.get("/delete/:id", async (req, res) => {
  const dssv = await getDssv();
  let spindex = req.params.id
    ? dssv.findIndex((user) => user.mssv == req.params.id)
    : -1;

  if (spindex < 0) {
    req.session.message = {
      type: "danger",
      message: "Mã số user không tồn tại",
      intro: "Xóa user thất bại",
    };
  } else {
    let user = dssv[spindex];
    //delete user
    await deleteUserByMssv(req.params.id);

    req.session.message = {
      type: "success",
      message: "Đã xóa user: " + user.username,
      intro: "Xóa user thành công",
    };
  }
  return res.redirect("/");
});

//user info
UsersRouter.get("/:id", async (req, res) => {
  const user = await getUserByMssv(req.params.id);
  res.render("detail", {
    style: "detailStyle.css",
    data: user,
    message: !user ? "Mã sản phẩm không tồn tại" : "",
  });
});

//edit user
UsersRouter.get("/edit/:id", async (req, res) => {
  const user = await getUserByMssv(req.params.id);
  res.render("edit", {
    style: "editPageStyle.css",
    data: user,
    message: !user ? "Mã sản phẩm không tồn tại" : "",
  });
});

UsersRouter.post("/edit/:id", async (req, res) => {
  const updateUser = req.body;
  try {
    await updateUserByMssv(req.params.id, updateUser);
    req.session.message = {
      type: "success",
      message: "Đã update user: " + updateUser.username,
      intro: "Update user thành công",
    };
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Xảy ra lỗi trong quá trình update user",
      intro: "Update user thất bại",
    };
    console.log(error);
  }
  res.redirect("/");
});

module.exports = UsersRouter;
