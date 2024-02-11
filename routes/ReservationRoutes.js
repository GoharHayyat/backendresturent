const express = require('express');
const router = express.Router();
const Reservation = require('../db/Reservation');
const Coupon = require('../db/Coupon');
const nodemailer = require('nodemailer');




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});



router.post('/book', async(req, res) => {
    try {
        console.log('Received POST request to /book:', req.body);

        const { slot, date, name, email, phone, noOfPersons } = req.body;

        // Check if the user is booking for the first time
        const existingBooking = await Reservation.findOne({ email });

        if (!existingBooking) {
            // Generate a random 6-digit coupon
            const couponCode = generateCoupon();

            // Save the coupon to the database
            const coupon = new Coupon({
                coupon: couponCode,
                email,
                date,
                Reservation: true,
                discountPercentage: 10,
            });
            await coupon.save();

            console.log('Coupon generated for first-time user:', couponCode);

            // Send email to the first-time user
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Welcome to Restaurant Hub!',
                text: `Dear ${name},\n\nThank you for choosing Restaurant Hub. As a token of our appreciation, please enjoy a 10% discount on your first booking with us. Your coupon code is: ${couponCode}.\n\nWe look forward to serving you!\n\nBest regards,\nRestaurant Hub`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        // Create a new reservation document
        const reservation = new Reservation({
            slot,
            date,
            name,
            email,
            phone,
            noOfPersons
        });
        await reservation.save();

        console.log('Booking successful');
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Restaurant Hub!',
            text: `Dear ${name},\n\nThank you for choosing Restaurant Hub. This is the Confirmationm mail that your table is Reserved.\n\nWe look forward to serving you!\n\nBest regards,\nRestaurant Hub`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json({ message: 'Booking successful' });
    } catch (error) {
        console.error('Error in /book route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Function to generate a random 6-digit coupon


function generateCoupon() {
    const couponLength = 6;
    const characters = '0123456789';
    let coupon = '';
    for (let i = 0; i < couponLength; i++) {
        coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return coupon;
}






router.get('/availability', async(req, res) => {
    const { date } = req.query;

    try {
        const reservations = await Reservation.find({ date: new Date(date) });
        const bookedSlots = reservations.map(reservation => parseInt(reservation.slot)); // Parse slot as integer
        const allSlots = [1, 2, 3, 4, 5, 6]; // Assuming total 6 slots available
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        res.json({ availableSlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Error fetching availability' });
    }
});





module.exports = router;