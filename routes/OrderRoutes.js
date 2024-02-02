const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Orders = require("../db/Orders");

router.use(bodyParser.json());


router.post('/orders', async(req, res) => {
    try {
        const { userId, products, totalPrice } = req.body;
        console.log((req.body))

        // Create a new order object
        const order = new Orders({ userId, products, totalPrice, });

        // Save the order to the database
        await order.save();

        res.status(201).json({ message: 'Order submitted successfully', orderId: order._id });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ message: 'Failed to submit order' });
    }
});

// router.get('/getorder/:userId', async(req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log(userId)

//         // Find orders by user ID
//         const orders = await Orders.find({ userId });
//         console.log('Orders found:', orders);

//         if (!orders) {
//             return res.status(404).json({ message: 'No orders found for the specified user' });
//         }

//         res.status(200).json({ orders });
//     } catch (error) {
//         console.error('Error retrieving orders:', error);
//         res.status(500).json({ message: 'Failed to retrieve orders' });
//     }
// });

router.get('/allorders', async(req, res) => {
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;