const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     // required: true
    // },
    // email: {
    //     type: String,
    //     // required: true,
    //     // unique: true
    // },
    // password: {
    //     type: String,
    //     // required: true
    // },
    // phone: {
    //     type: Number,
    // },
    // NoOfPersons: {
    //     type: String,
    // },
    bookings: [{
        slot: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
});

module.exports = mongoose.model('Reservation', reservationSchema);