const mongoose = require("mongoose");

const CPSchema = new mongoose.Schema({
  title: { type: String },
  image: String,
});

module.exports = cpModel = mongoose.model("CP", CPSchema);
