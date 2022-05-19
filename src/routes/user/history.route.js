const express = require("express");
const { GetListRecharge } = require("../../models/recharge.models");
const ServiceHistory = express.Router();
const Recharge = require("../../mongos/recharge.mongo");

//Get list of transaction
ServiceHistory.get("/recharge", async (req, res) => {
  const data = await GetListRecharge();

  return res.render("history/recharge_history", {
    style: "../../../css/historyListPageStyle.css",
    data: data,
  });
});

//Get detail
ServiceHistory.get("/recharge/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Recharge.findOne({ _id: id }).lean();

  console.log(data.fullname);

  return res.render("detail/recharge_detail", {
    style: "../../../../css/transactionDetailPageStyle.css",
    data,
  });
});

module.exports = ServiceHistory;
