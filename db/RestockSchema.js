const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: Object,
  orderDate: Date,
  bulk: Boolean,
});


const Restock = mongoose.model('Restock', orderSchema);

module.exports = Restock;