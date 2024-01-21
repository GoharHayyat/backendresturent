const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Restock = require("../db/RestockSchema");

router.use(bodyParser.json());



router.post('/restock', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const orderData = req.body.orderData; // Assuming orderData is sent in the request body
    console.log(orderData);

    // Create a new order instance
    const newOrder = new Restock({
      products: orderData.products,
      orderDate: orderData.orderDate,
      bulk: true,
    });

    // Save the order to the database
    await newOrder.save();

    console.log('Order data stored in the database');

    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/allrestocks', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Retrieve all products from the database
    const allProducts = await Restock.find();

    // Send the list of products as a response
    res.status(200).json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;





