const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ name: String, price: Number, quantity: Number }],
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }, // Date and time of ordering
    onlinePayment: { type: Boolean, default: false }, // Online payment status
    tableNo: { type: Object, required: true },
    invoiceid: { type: String, required: true },
    orderstatus: { type: String, default: "pending" },
});

const Order = mongoose.model('Orders', orderSchema);



module.exports = Order;