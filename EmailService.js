// emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "goharhsaygx@outlook.com",
        pass: "1w2q3r4eEE",
    }
});

// Function to send an email
const sendEmail = async (options) => {
    try {
        const result = await transporter.sendMail(options);
        console.log("Email sent:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };
