const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone_number: { type: String, require },
  email: { type: String, require },
  fullname: { type: String, require },
  birthdate: { type: Date, require },
  address: { type: String, require },
  font_photoPath: { type: String, require },
  back_photoPath: { type: String, require },
});

module.exports = mongoose.model("User", UserSchema);
