const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Import the QRCode model
const QRCode = require('../db/QRCode');

router.post('/qrstore', async (req, res) => {
  try {
    // Extract data from the request body
    const { table, tableid } = req.body;

    // Delete existing data with the same table number
    await QRCode.deleteMany({ table: table });

    // Save the QR code information to MongoDB
    const qrCode = new QRCode({
      table: table,
      tableId: tableid,
    });

    await qrCode.save();

    console.log('QR Code Information saved to MongoDB:', { table, tableid });
    res.status(200).json({ message: 'QR Code Information saved to MongoDB' });
  } catch (error) {
    console.error('Error saving QR Code Information to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/qrcodestokens', async (req, res) => {
    try {
      // Retrieve all QR code information from MongoDB
      const allQRCodes = await QRCode.find();
  
      res.status(200).json(allQRCodes);
    } catch (error) {
      console.error('Error retrieving QR Code information from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
