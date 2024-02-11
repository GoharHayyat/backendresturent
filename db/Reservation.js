const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
});

module.exports = mongoose.model('Reservation', reservationSchema);