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
      status: "pending", //yahan appoved or reject handle krna 
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

router.post('/normalrestock', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const orderData = req.body.orderData; // Assuming orderData is sent in the request body
    console.log(orderData);

    // Create a new order instance
    const newOrder = new Restock({
      products: orderData.products,
      orderDate: orderData.orderDate,
      bulk: false,
      status: "pending", //yahan appoved or reject handle krna 
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

router.get('/findrestock/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Retrieve a specific restock by ID from the database

    const restock = await Restock.findById(req.params.id);

    // console.log(req.params.id)

    // Check if the restock with the given ID exists
    if (!restock) {
      return res.status(404).json({ error: 'Restock not found' });
    }

    // Send the restock data as a response
    res.status(200).json(restock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleterestock/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Retrieve and delete a specific restock by ID from the database
    const restock = await Restock.findByIdAndDelete(req.params.id);

    // Check if the restock with the given ID exists
    if (!restock) {
      return res.status(404).json({ error: 'Restock not found' });
    }

    // Send a success message as a response
    res.status(200).json({ message: 'Restock deleted successfully', deletedRestock: restock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put("/restockstatus/:id/", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const productId = req.params.id;
    const newStatus = req.body.status;  // Assuming you send the new status in the request body

    console.log(productId, newStatus);

    // Find the restock item by ID
    const restock = await Restock.findById(productId);

    // Check if the restock item with the given ID exists
    if (!restock) {
      return res.status(404).json({ error: "Restock item not found with the provided ID." });
    }

    // Update the 'status' field with the new status
    restock.status = newStatus;

    // Save the updated restock item to the database
    const updatedRestock = await restock.save();

    res.status(200).json(updatedRestock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





module.exports = router;





