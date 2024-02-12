// routes.js
const express = require('express');
const router = express.Router();
const HR = require('../db/HR');

// POST /api/employees/add
router.post('/addemploye', async(req, res) => {
    try {
        const newUser = await HR.create(req.body);
        console.log("Employe added", req.body)

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getemploye', async(req, res) => {
    try {
        const employees = await HR.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;