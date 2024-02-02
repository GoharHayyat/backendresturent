const  bcrypt = require("bcrypt")
const User = require("../db/user")
// import { sendEmail } from "../utils/sendEmail.js";
const crypto = require("crypto")
// import { CALLBACK_LINK } from "../config/config.js";impo
const { sendEmail } = require("../EmailService");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 465,
  secure: true,
    auth : {
        user : "info.restaurantshub@gmail.com",
        pass : "wdvd mgce nkvo cxug",
        // pass : "flpm tvlb rdgi ycol",
    }
})

// const transporter = nodemailer.createTransport({
//     service : "hotmail",
//     auth : {
//         user : "restaurentshub@outlook.com",
//         pass : "1w2q3r4eEE",
//     }
// })

// const options = {
//     from : "Restaurentshub@outlook.com", 
//     to: "goharchisthi@gmail.com", 
//     subject: "Reset password", 
//     text: "Here is a reset token."
// }


// transporter.sendMail(options, (error, info) =>{
//     if(error) console.log(error)
//     else console.log(info)
// })


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
    // console.log(" cnm")

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not Found",
            });
        }

        const resetToken = user.getResetPasswordToken();
        // console.log("token",resetToken)

        // console.log(user.resetPasswordToken)
        await user.save();

//         const resetUrl = `http://localhost:3000/resetpassword/${user.resetPasswordToken}`;
//         const message = `
//     <h1>You have requested a new Password</h1>
//     <p>Please go to the following link to reset your password:</p>
//     <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Link</a>
// `;

//         const options = {
//             from : "info.restaurantshub@gmail.com", 
//             to: email, 
//             subject: "Reset password", 
//             text: message,
//         }
const resetUrl = `http://localhost:3000/resetpassword/${user.resetPasswordToken}`;
const message = `
    <html>
        <head>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #007bff;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset Request</h1>
                <p>You have requested a new password. Please follow the link below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #f8f6f5; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
        </body>
    </html>
`;

const options = {
    from: "info.restaurantshub@gmail.com", 
    to: email, 
    subject: "Password Reset Request", 
    html: message,
};


        
        
        transporter.sendMail(options, (error, info) =>{
            if(error)
            {
                    return res.status(500).json({
                success: false,
                error: "Email could not be sent",
            });
                // console.log(error)
            } 
            else 
            {
                res.status(200).json({
                            success: true,
                            data: "email sent",
                        });
                // console.log(info)
            }
        })

        // const resetUrl = `http://localhost:4500/resetpassword/${resetToken}`;
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