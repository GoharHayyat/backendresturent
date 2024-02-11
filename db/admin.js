const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isSuperadmin: {
        type: Boolean,
    },
    isAdmin: {
        type: Boolean,
    }
});

module.exports = mongoose.model('admin', adminSchema);