const express = require('express');
const router = express.Router();
const Reservation = require('../db/Reservation');



router.post('/book', async(req, res) => {
    try {
        console.log('Received POST request to /book:', req.body);

        const { slot, date, name, email, phone, noOfPersons } = req.body;


        // Check if the slot is already booked for the selected date
        const existingBooking = await Reservation.findOne({ date, slot });

        if (existingBooking) {
            console.log('Slot already booked for the selected date');
            return res.status(400).json({ error: 'Slot already booked for the selected date' });
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
        res.status(201).json({ message: 'Booking successful' });
    } catch (error) {
        console.error('Error in /book route:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/availability', async(req, res) => {
    const { date } = req.query;

    try {
        const reservations = await Reservation.find({ date: new Date(date) });
        const bookedSlots = reservations.map(reservation => reservation.slot);
        const allSlots = [1, 2, 3, 4, 5, 6]; // Assuming total 6 slots available
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        res.json({ availableSlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Error fetching availability' });
    }
});

module.exports = router;