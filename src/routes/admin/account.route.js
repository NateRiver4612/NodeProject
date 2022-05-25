const express = require("express");
const { body } = require("express-validator");
const { getAccounts, getAccount } = require("../../models/admin.model");
const User = require("../../mongos/user.mongo");
const AccountsRoute = express.Router();

function toDate(date) {
  const result = date;
  return new Date(
    result
      .toString()
      .replaceAll("st", "")
      .replaceAll("nd", "")
      .replaceAll("rd", "")
  );
}

AccountsRoute.get("/", (req, res) => {
  return res.send("Hello");
});

//--------------------------------------------------ROUTE FOR PENDING ACCOUNTS-----------------------------------------
AccountsRoute.get("/pending", async (req, res) => {
  const data = await getAccounts("pending");

  data.sort(function (a, b) {
    console.log(toDate(b.created_date));
    return toDate(b.created_date) - toDate(a.created_date);
  });

  return res.render("admin/accounts/pending/account_pending", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

AccountsRoute.get("/pending/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getAccount(id);

  data.birthdate = data.birthdate.toString().split(" ").splice(1, 3).join("-");
  data.font_photoPath = data.font_photoPath.split("public\\")[1];
  data.back_photoPath = data.back_photoPath.split("public\\")[1];

  return res.render("admin/accounts/pending/account_pending_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

AccountsRoute.post("/pending/:id/activate", async (req, res) => {
  const { admin_account_id } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: admin_account_id },
      { status: "activated" }
    );
    return res.redirect("/admin/accounts/pending");
  } catch (e) {
    return res.send(e);
  }
});

AccountsRoute.post("/pending/:id/request", async (req, res) => {
  const { admin_account_request, admin_account_id } = req.body;
  console.log(admin_account_request, admin_account_id);
  try {
    await User.findOneAndUpdate(
      { _id: admin_account_id },
      { status: admin_account_request }
    );
    return res.redirect("/admin/accounts/pending");
  } catch (e) {
    return res.send(e);
  }
});

AccountsRoute.post("/pending/:id/cancel", async (req, res) => {
  const { admin_account_id } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: admin_account_id },
      { status: "canceled" }
    );
    return res.redirect("/admin/accounts/pending");
  } catch (e) {
    return res.send(e);
  }
});

//--------------------------------------------------ROUTE FOR ACTIVATED ACCOUNTS-----------------------------------------
AccountsRoute.get("/activated", async (req, res) => {
  const data = await getAccounts("activated");

  data.sort(function (a, b) {
    console.log(toDate(b.created_date));
    return toDate(b.created_date) - toDate(a.created_date);
  });

  return res.render("admin/accounts/activated/account_activated", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

AccountsRoute.get("/activated/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getAccount(id);

  data.birthdate = data.birthdate.toString().split(" ").splice(1, 3).join("-");
  data.font_photoPath = data.font_photoPath.split("public\\")[1];
  data.back_photoPath = data.back_photoPath.split("public\\")[1];

  return res.render("admin/accounts/activated/account_activated_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

//--------------------------------------------------ROUTE FOR ACTIVATED ACCOUNTS-----------------------------------------
AccountsRoute.get("/canceled", async (req, res) => {
  const data = await getAccounts("canceled");

  data.sort(function (a, b) {
    console.log(toDate(b.created_date));
    return toDate(b.created_date) - toDate(a.created_date);
  });

  return res.render("admin/accounts/canceled/account_canceled", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

AccountsRoute.get("/canceled/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getAccount(id);

  data.birthdate = data.birthdate.toString().split(" ").splice(1, 3).join("-");
  data.font_photoPath = data.font_photoPath.split("public\\")[1];
  data.back_photoPath = data.back_photoPath.split("public\\")[1];

  return res.render("admin/accounts/canceled/account_canceled_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

//--------------------------------------------------ROUTE FOR UNLOCK ACCOUNTS-----------------------------------------
AccountsRoute.get("/locked", async (req, res) => {
  const data = await User.find({ locked: true }).lean();

  data.sort(function (a, b) {
    console.log(toDate(b.last_update));
    return toDate(b.last_update) - toDate(a.last_update);
  });

  return res.render("admin/accounts/locked/account_locked", {
    layout: "admin",
    style: "../../../css/style.css",
    data,
  });
});

AccountsRoute.get("/locked/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getAccount(id);

  data.birthdate = data.birthdate.toString().split(" ").splice(1, 3).join("-");
  data.font_photoPath = data.font_photoPath.split("public\\")[1];
  data.back_photoPath = data.back_photoPath.split("public\\")[1];

  return res.render("admin/accounts/locked/account_locked_detail", {
    layout: "admin",
    style: "../../../../css/style.css",
    data,
  });
});

AccountsRoute.post("/locked/:id/unlock", async (req, res) => {
  const { admin_account_id } = req.body;

  try {
    await User.findOneAndUpdate(
      { _id: admin_account_id },
      { locked: false, wrong_password_signIn: 0, status: "activated" }
    );

    return res.redirect("/admin/accounts/locked");
  } catch (e) {
    return res.send(e);
  }
});

module.exports = AccountsRoute;
