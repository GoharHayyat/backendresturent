const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Import the QRCode model
const QRCode = require('../db/QRCode');

router.post('/qrstore', async (req, res) => {
  try {
   
    const { table, tableid } = req.body;
    console.log(table)

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

  router.delete('/deleteqr/:id', async (req, res) => {
    const id = req.params.id;

  
    try {
      // Find and delete the QR code by table number
      const deletedQRCode = await QRCode.findOneAndDelete({ table: id });
  
      if (!deletedQRCode) {
        return res.status(404).json({ error: 'QR Code not found' });
      }
  
      res.status(200).json({ message: 'QR Code deleted successfully', deletedQRCode });
    } catch (error) {
      console.error('Error deleting QR Code from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
