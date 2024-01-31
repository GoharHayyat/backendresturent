const  bcrypt = require("bcrypt")
const User = require("../db/user")
// import { sendEmail } from "../utils/sendEmail.js";
const crypto = require("crypto")
// import { CALLBACK_LINK } from "../config/config.js";

async function register(req, res, next) {
    const { name, email, password, phone, address, isAdmin  } =
        req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            isAdmin,
            
            address,
            phone,
        });

        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Please provide both Email and Password",
        });
    }
    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Invalid Credentials",
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(404).json({
                success: false,
                error: "Invalid Credentials!",
            });
        } else {
            sendToken(user, 200, res);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

async function forgotPassword(req, res, next) {
    const { email } = req.body;
    console.log(" cnm")

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not Found",
            });
        }

        const resetToken = user.getResetPasswordToken();
        console.log(resetToken)

        console.log(user)
        await user.save();

        // const resetUrl = `${CALLBACK_LINK}resetpassword/${resetToken}`;
        // const message = `
        // <h1>You have requested a new Password</h1>
        // <p>Please go To the following link to reset your password.</p>
        // <a href=${resetUrl} clicktracking=off><h2>Reset Link</h2></a>
        // `;

        // try {
        //     sendEmail({
        //         to: user.email,
        //         subject: "Password Reset Request",
        //         text: message,
        //     }).then((result)=>console.log("Email sent..",result)).catch((error)=>console.log("error email not sent:",error))

        //     res.status(200).json({
        //         success: true,
        //         data: "email sent",
        //     });
        // } catch (error) {
        //     user.resetPasswordToken = undefined;
        //     user.resetPasswordExpire = undefined;
        //     await user.save();

        //     return res.status(500).json({
        //         success: false,
        //         error: "Email could not be sent",
        //     });
        // }
    } catch (error) {
        next(error);
    }
}

async function resetPassword(req, res, next) {
    // console.log(req.params.resetToken)
    // const resetPasswordToken = crypto
    //     .createHash("sha256")
    //     .update(req.params.resetToken)
    //     .digest("hex");

        // console.log("cd",resetPasswordToken)

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.resetToken,
            // resetPasswordExpire: { $gt: Date.now() },
          });
    //    console.log(user)
        if (!user) {
            return res.status(400).json({
                success:false,
                error:"Invalid Reset Token"
            });
        }
        
        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        return res.status(201).json({
            success:true,
            data: "password changed Successfully",
            token: user.getSignedToken()
        })

    } catch (error) {
        next(error);
     }
}

// This funtions us used to send back response and to avoid repetition of code in loging and register routes
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        success: true,
        token,
        favorites:user,
    });
};
module.exports = {register,login,forgotPassword,resetPassword};