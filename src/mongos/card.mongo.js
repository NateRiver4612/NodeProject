const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  card_number: String,
  expired: String,
  cvv: String,
  note: String,
});

module.exports = mongoose.model("Card", CardSchema);
