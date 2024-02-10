const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Orders = require("../db/Orders");
const User = require("../db/user");
router.use(bodyParser.json());
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

// Rest of your code

// const { EMAIL_FROM, EMAIL_PASSWORD } = require("../config/config");

const nodemailer = require("nodemailer");

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

router.post("/orders", async(req, res) => {
            try {
                const { userId, products, totalPrice, tableNo } = req.body;
                // console.log(req.body);

                const user = await User.findById(userId);

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: "User not Found",
                    });
                }

                const characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                let invoiceid = "";

                for (let i = 0; i < 20; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    invoiceid += characters.charAt(randomIndex);
                }
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
                const day = currentDate.getDate();
                const formattedDate = `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;



                const htmlTemplate = `
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

                                            <h1 style="margin-top:0;color:#111111;font-size:24px;line-height:36px;font-weight:600;margin-bottom:24px;" >Hi ${user.name},</h1>

                                            <p style="color:#4a5566;margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;font-size:16px;line-height:28px;" >This is an invoice for your recent purchase.</p>

                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
                                                <tr>
                                                    <td style="padding-top:20px;padding-bottom:20px;padding-right:0;padding-left:0;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

                                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
                                                            <tr>
                                                                <td valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
                                                                    <h3 style="margin-top:0;color:#111111;font-size:18px;line-height:26px;font-weight:600;margin-bottom:24px;" >${tableNo.tableId}</h3>
                                                                </td>
                                                                <td align="right" valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
                                                                    <h3 style="margin-top:0;color:#111111;font-size:18px;line-height:26px;font-weight:600;margin-bottom:24px;" >${formattedDate}</h3>
                                                                </td>
                                                            </tr>
                                                        </table>

                                                        <table class="table" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
                                                            <tr>
                                                                <th align="left" style="font-family:'Inter', Helvetica, Arial, sans-serif;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#85878E;font-size:13px;font-weight:600;line-height:18px;" >
                                                                    Name
                                                                </th>
                                                                <th align="right" style="font-family:'Inter', Helvetica, Arial, sans-serif;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#85878E;font-size:13px;font-weight:600;line-height:18px;" >
                                                                    quantity
                                                                </th>
                                                                <th align="right" style="font-family:'Inter', Helvetica, Arial, sans-serif;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#85878E;font-size:13px;font-weight:600;line-height:18px;" >
                                                                    Amount
                                                                </th>
                                                            </tr>

                                                            ${products.map(product => `
                                                            <tr>
                                                                <td valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
                                                                    ${product.name}
                                                                </td>
                                                                <td valign="middle" align="right" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
                                                                    ${product.quantity}
                                                                </td>
                                                                <td valign="middle" align="right" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
                                                                    ${product.price * product.quantity}
                                                                </td>
                                                            </tr>
                                                        `).join('')}

                                                            <tr>
                                                                <td style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
                                                                    <h4 style="margin-top:0;color:#111111;font-size:16px;line-height:24px;font-weight:600;margin-bottom:16px;" >Total</h4>
                                                                </td>
                                                                <td align="right" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
                                                                    <h4 style="margin-top:0;color:#111111;font-size:16px;line-height:24px;font-weight:600;margin-bottom:16px;" >${totalPrice}</h4>
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
      to: user.email,
      subject: "Order Invoice",
      html: htmlTemplate,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: "Email could not be sent",
        });
        // console.log(error)
      } else {
        res.status(201).json({
          success: true,
          data: "email sent",
        });
        // console.log(info);
      }
    });

    const order = new Orders({ userId, products, totalPrice, invoiceid,tableNo });

    await order.save();

    res
      .status(201)
      .json({ message: "Order submitted successfully", orderId: order._id });
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).json({ message: "Failed to submit order" });
  }
});

router.get('/getorder/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)

        // Find orders by user ID
        const orders = await Orders.find({ userId });
        console.log('Orders found:', orders);

        if (!orders) {
            return res.status(404).json({ message: 'No orders found for the specified user' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
});


router.get("/allorders", async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/updatetheOrderStatus/:orderId', async (req, res) => {
    const { orderStatus } = req.body;
    const { orderId } = req.params;
  
    try {
      // Find the order by ID and update the orderStatus
      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        { $set: { orderstatus: orderStatus } },
        { new: true } // To get the updated document as the result
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;