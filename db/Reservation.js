const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },

    phone: {
        type: Number,
    },
    noOfPersons: {
        type: String,
    },
    slot: { type: Number, required: true },
    date: {
        type: Date,
        required: true
    },
    coupon: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    },

});

module.exports = mongoose.model('Reservation', reservationSchema);