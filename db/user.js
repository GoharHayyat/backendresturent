const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    phone: { type: String },
    // isVendor: { type: Boolean, default: false },
    img: { type: String },
    // isSeller: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// This method is for generating a token using the users _id and and a secret key
userSchema.methods.getSignedToken = function() {
    return jwt.sign({ id: this._id }, "secret key");
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

// // Monggose lets us make methods so we are creating a method that checks for password match
userSchema.methods.matchPasswords = async function(password) {
    const match = await bcrypt.compare(password, this.password);
    return match;
};





const User = mongoose.model("User", userSchema);
module.exports = User;