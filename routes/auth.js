
const express = require("express");
const authController = require("../controllers/authController.js")
const router = express.Router();


router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/forgotpassword",authController.forgotPassword);
router.put("/resetpassword/:resetToken", authController.resetPassword);

module.exports = router;