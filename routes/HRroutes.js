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

router.put('/changestatus/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Convert `status` to boolean if needed
        const newStatus = status === 'true' ? true : false;

        // Find the employee by id and update the status
        const updatedEmployee = await HR.findByIdAndUpdate(id, { status: newStatus }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error changing employee status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;