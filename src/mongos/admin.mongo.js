const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", AdminSchema);
