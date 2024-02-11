const express = require('express');
const router = express.Router();
const Coupon = require('../db/Coupon');



router.post('/verifycoupon', async(req, res) => {
    try {
        const { coupon } = req.body;
        console.log("Received coupon:", coupon); // Log the received coupon

        // Find the coupon in the database
        const couponn = await Coupon.findOne({ coupon: coupon });

        if (!couponn) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        if (!couponn.Active) {
            return res.status(400).json({ error: 'Coupon has already been used' });
        }

        // Check if Reservation is true and if the coupon is used on the given date
        if (couponn.Reservation) {
            const currentDate = new Date();
            const couponDate = new Date(couponn.date);

            // Check if the current date is equal to the coupon date
            if (currentDate.toDateString() !== couponDate.toDateString()) {
                return res.status(400).json({ error: 'Coupon can only be used on the given date' });
            }

            // Update the coupon status only if Reservation is true and the coupon is used on the given date
            // couponn.Active = false;
            await couponn.save();
        }

        res.json({ success: true, message: 'Coupon verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/verifycouponupdate', async(req, res) => {
    try {
        const { coupon } = req.body;
        console.log("Received coupon:", coupon); // Log the received coupon

        // Find the coupon in the database
        const couponn = await Coupon.findOne({ coupon: coupon });

        if (!couponn) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        if (!couponn.Active) {
            return res.status(400).json({ error: 'Coupon has already been used' });
        }

        // Check if Reservation is true and if the coupon is used on the given date
        if (couponn.Reservation) {
            const currentDate = new Date();
            const couponDate = new Date(couponn.date);

            // Check if the current date is equal to the coupon date
            if (currentDate.toDateString() !== couponDate.toDateString()) {
                return res.status(400).json({ error: 'Coupon can only be used on the given date' });
            }

            // Update the coupon status only if Reservation is true and the coupon is used on the given date
            couponn.Active = false;
            await couponn.save();
        }

        res.json({ success: true, message: 'Coupon verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/coupon-details', async(req, res) => {
    try {
        const { coupon } = req.query;

        // Find the coupon in the database
        const couponDetails = await Coupon.findOne({ coupon });

        if (!couponDetails) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({ success: true, coupon: couponDetails });
    } catch (error) {
        console.error('Error fetching coupon details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.post('/addcoupon', async(req, res) => {
    try {
        const { coupon, discountPercentage } = req.body;

        // Check if the coupon number already exists
        const existingCoupon = await Coupon.findOne({ coupon });

        if (existingCoupon) {
            return res.status(400).json({ error: 'Coupon number already exists' });
        }

        // Create a new coupon
        const newCoupon = new Coupon({
            coupon,
            discountPercentage
        });

        // Save the new coupon to the database
        await newCoupon.save();

        res.json({ success: true, message: 'Coupon added successfully' });
    } catch (error) {
        console.error('Error adding coupon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/toggleactive', async(req, res) => {
    try {
        const { coupon, active } = req.body;
        // console.log(req.body)

        // Find the coupon in the database
        const foundCoupon = await Coupon.findOne({ coupon });

        if (!foundCoupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // Update the Active status of the coupon
        foundCoupon.Active = active;
        await foundCoupon.save();

        res.json({ success: true, message: `Coupon ${active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error toggling Active:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/coupons', async(req, res) => {
    try {
        const coupons = await Coupon.find({ Reservation: false });
        res.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;