const dummyLogin = require('../models/dummyLogin');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Check if user exists
    const user = await dummyLogin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Save user session
    req.session.user = user;

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
