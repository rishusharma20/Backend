const mongoose = require("mongoose");

const UniversitySchema = new mongoose.Schema({
  aisheCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  contact: { type: String},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("University", UniversitySchema);
