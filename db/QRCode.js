// models/QRCode.js

const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  table: {
    type: Number,
    required: true,
  },
  tableId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
