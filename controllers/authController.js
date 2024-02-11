const bcrypt = require("bcrypt")
const User = require("../db/user")
    // import { sendEmail } from "../utils/sendEmail.js";
const crypto = require("crypto")
    // const { EMAIL_FROM, EMAIL_PASSWORD } = require("../config/config");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
        // pass : "flpm tvlb rdgi ycol",
    },
});

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
//     if(error) error)
//     else console.log(info)
// })


async function register(req, res, next) {
    const { name, email, password, phone, address, isAdmin } =
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

        // console.log(user.name)
        const resetToken = user.getResetPasswordToken();
        // console.log("token",resetToken)

        // console.log(user.resetPasswordToken)
        await user.save();
        const resetUrl = `${process.env.RESET_PASSWORD_ADRRESS}/resetpassword/${user.resetPasswordToken}`;
        const message = `
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>

    <!--[if !mso]><!-->
    <style type="text/css">
        @import url('https://fonts.mailersend.com/css?family=Inter:400,600');
    </style>
    <!--<![endif]-->

    <style type="text/css" rel="stylesheet" media="all">
        @media only screen and (max-width: 640px) {
            .ms-header {
                display: none !important;
            }
            .ms-content {
                width: 100% !important;
                border-radius: 0;
            }
            .ms-content-body {
                padding: 30px !important;
            }
            .ms-footer {
                width: 100% !important;
            }
            .mobile-wide {
                width: 100% !important;
            }
            .info-lg {
                padding: 30px;
            }
        }
    </style>
    <!--[if mso]>
    <style type="text/css">
    body { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td * { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td p { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td a { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td span { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td div { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td ul li { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td ol li { font-family: Arial, Helvetica, sans-serif!important  !important; }
    td blockquote { font-family: Arial, Helvetica, sans-serif!important  !important; }
    th * { font-family: Arial, Helvetica, sans-serif!important  !important; }
    </style>
    <![endif]-->
</head>
<body style="font-family:'Inter', Helvetica, Arial, sans-serif; width: 100% !important; height: 100%; margin: 0; padding: 0; -webkit-text-size-adjust: none; background-color: #f4f7fa; color: #4a5566;" >

<div class="preheader" style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;" ></div>

<table class="ms-body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background-color:#f4f7fa;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
    <tr>
        <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

            <table class="ms-container" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
                <tr>
                    <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

                        <table class="ms-header" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
                            <tr>
                                <td height="40" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
                                    &nbsp;
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
                <tr>
                    <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

                        <table class="ms-content" width="640" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:640px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#FFFFFF;border-radius:6px;box-shadow:0 3px 6px 0 rgba(0,0,0,.05);" >
                            <tr>
                                <td class="ms-content-body" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:40px;padding-bottom:40px;padding-right:50px;padding-left:50px;" >

                                    <p class="logo" style="margin-right:0;margin-left:0;line-height:28px;font-weight:600;font-size:21px;color:#111111;text-align:center;margin-top:0;margin-bottom:40px;" ><span style="color:#0052e2;font-family:Arial, Helvetica, sans-serif;font-size:30px;vertical-align:bottom;" >❖&nbsp;</span>RestaurantHub</p>

                                    <h1 style="margin-top: 0; color: #111111; font-size: 24px; line-height: 36px; font-weight: 600; margin-bottom: 24px;">
  Hi ${user.name.toUpperCase()},
</h1>


                                    <p style="color:#4a5566;margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;font-size:16px;line-height:28px;" >You recently requested to reset your password for your account. Click the button below to reset it. <strong style="font-weight:600;" >This password reset is only valid for the next 24 hours</strong>.</p>

                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;" >
                                        <tr>
                                            <td align="center" style="padding-top:20px;padding-bottom:20px;padding-right:0;padding-left:0;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

                                                <table class="mobile-wide" border="0" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse:collapse;" >
                                                    <tr>
                                                        <td align="center" class="btn" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;background-color:#0052e2;box-shadow:0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);border-radius:3px;" >
                                                            <a href="${resetUrl}" target="_blank" style="background-color:#0052e2;padding-top:14px;padding-bottom:14px;padding-right:30px;padding-left:30px;display:inline-block;color:#FFF;text-decoration:none;border-radius:3px;-webkit-text-size-adjust:none;box-sizing:border-box;border-width:0px;border-style:solid;border-color:#0052e2;font-weight:600;font-size:15px;line-height:21px;letter-spacing:0.25px;" >Reset your password</a>
                                                        </td>
                                                    </tr>
                                                </table>

                                            </td>
                                        </tr>
                                    </table>

                                    

                                    <table width="100%" style="border-collapse:collapse;" >
                                        <tr>
                                            <td height="20" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
                                                &nbsp;
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="20" style="font-size:0px;line-height:0px;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
                                                &nbsp;
                                            </td>
                                        </tr>
                                    </table>

                                    <p class="small" style="color:#4a5566;margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;font-size:14px;line-height:21px;" >If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                                    <p class="small" style="color:#4a5566;margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;font-size:14px;line-height:21px;" >${resetUrl}</p>

                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
                
            </table>

        </td>
    </tr>
</table>

</body>
</html>
`;

        const options = {
            from: "info.restaurantshub@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: message,
        };




        transporter.sendMail(options, (error, info) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    error: "Email could not be sent",
                });
                // console.log(error)
            } else {
                res.status(200).json({
                    success: true,
                    data: "Email sent",
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
                success: false,
                error: "Invalid Reset Token"
            });
        }

        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        return res.status(201).json({
            success: true,
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
        favorites: user,
    });
};
module.exports = { register, login, forgotPassword, resetPassword };