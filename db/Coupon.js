const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    coupon: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    Reservation: {
        type: Boolean,
        default: false
    },
    Active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Coupon', CouponSchema);