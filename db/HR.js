// user.js
const mongoose = require('mongoose');

const HRSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    contact: String,
    salary: Number,
    date: Date,
    department: String,
    designation: String,
    shift: String,
    status: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('HR', HRSchema);