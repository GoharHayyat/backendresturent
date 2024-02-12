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



router.get('/reservations', async(req, res) => {
    try {
        // Query the Reservation collection to get all reservations
        const reservations = await Reservation.find();

        // Send the retrieved reservations as a response
        res.json(reservations);
    } catch (error) {
        // If an error occurs, send a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
});

router.get('/filters', async(req, res) => {
    try {
        let { fromDate, toDate, email, name, phone } = req.query;
        let filters = {};

        // Convert filter values to lowercase for case-insensitive matching
        email = email ? email.toLowerCase() : '';
        name = name ? name.toLowerCase() : '';
        phone = phone ? phone.toLowerCase() : '';

        // Add date range filter if fromDate and toDate are provided
        if (fromDate && toDate) {
            filters.date = { $gte: fromDate, $lte: toDate };
        }

        // Add other filters if provided
        if (email) filters.email = { $regex: email, $options: 'i' }; // Case-insensitive regex
        if (name) filters.name = { $regex: name, $options: 'i' }; // Case-insensitive regex
        if (phone) filters.phone = { $regex: phone, $options: 'i' }; // Case-insensitive regex

        // Fetch reservations based on filters
        const reservations = await Reservation.find(filters);

        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;