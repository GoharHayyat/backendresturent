const express = require('express');
const router = express.Router();
const admin = require('../db/admin')







router.post('/adminlogin', async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await admin.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const { password: userPassword, ...userData } = user.toObject();
        res.json({ message: 'Login successful', user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;