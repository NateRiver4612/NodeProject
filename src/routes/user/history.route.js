const express = require("express");
const ServiceHistory = express.Router();
const Recharge = require("../../mongos/recharge.mongo");
const Mobile = require("../../mongos/mobile.mongo");
const Withdraw = require("../../mongos/withdraw.mongo");
const Transfer = require("../../mongos/transfer.mongo");

function toDate(date, time) {
  const restult = date + " " + time;
  // console.log(restult);
  // console.log(
  //   new Date(restult.toString().replaceAll("nd", "").replaceAll("st", ""))
  // );
  return new Date(
    restult
      .toString()
      .replaceAll("nd", "")
      .replaceAll("st", "")
      .replaceAll("rd", "")
  );
}

//Get list of recharge
ServiceHistory.get("/recharge", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const data = await Recharge.find({ username: current_user.username }).lean();

  data.sort(function (a, b) {
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("history/recharge_history", {
    style: "../../../css/style.css",
    data: data,
  });
});

//Get detail of recharge
ServiceHistory.get("/recharge/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Recharge.findOne({ _id: id }).lean();

  return res.render("detail/recharge_detail", {
    style: "../../../../css/style.css",
    data,
  });
});

//Get list of mobile
ServiceHistory.get("/mobile", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const data = await Mobile.find({ username: current_user.username }).lean();

  data.sort(function (a, b) {
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("history/mobile_history", {
    style: "../../../css/style.css",
    data: data,
  });
});

//Get detail of mobile
ServiceHistory.get("/mobile/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Mobile.findOne({ mobile_code: id }).lean();

  return res.render("detail/mobile_detail", {
    style: "../../../../css/style.css",
    data,
  });
});

//Get list of withdraw
ServiceHistory.get("/withdraw", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const data = await Withdraw.find({ username: current_user.username }).lean();

  data.sort(function (a, b) {
    console.log(toDate(b.date, b.time));
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("history/withdraw_history", {
    style: "../../../css/style.css",
    data: data,
  });
});

//Get detail of withdraw
ServiceHistory.get("/withdraw/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Withdraw.findOne({ _id: id }).lean();

  return res.render("detail/withdraw_detail", {
    style: "../../../../css/style.css",
    data,
  });
});

//Get list of transfer
ServiceHistory.get("/transfer", async (req, res) => {
  const current_user = JSON.parse(localStorage.getItem("user"));
  const data = await Transfer.find({ username: current_user.username }).lean();

  data.sort(function (a, b) {
    return toDate(b.date, b.time) - toDate(a.date, a.time);
  });

  return res.render("history/transfer_history", {
    style: "../../../css/style.css",
    data: data,
  });
});

//Get detail of transfer
ServiceHistory.get("/transfer/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Transfer.findOne({ _id: id }).lean();

  return res.render("detail/transfer_detail", {
    style: "../../../../css/style.css",
    data,
  });
});

module.exports = ServiceHistory;
