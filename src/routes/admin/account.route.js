const express = require("express");
const { getAccounts, getAccount } = require("../../models/admin.model");

const AccountsRoute = express.Router();

AccountsRoute.get("/", (req, res) => {
  return res.send("Hello");
});

//ROUTE FOR PENDING ACCOUNTS
AccountsRoute.get("/pending", async (req, res) => {
  const data = await getAccounts("pending");

  return res.render("admin/accounts/pending/account_pending", {
    layout: "admin",
    style: "../../../css/adminPageStyle.css",
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
    style: "../../../../css/adminPageStyle.css",
    data,
  });
});

module.exports = AccountsRoute;
