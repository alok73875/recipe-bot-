const express = require('express');
const router = express.Router();

// Register endpoint
router.post('/register', (req, res) => {
  res.json({ message: 'User registered successfully' });
});

// Login endpoint
router.post('/login', (req, res) => {
  res.json({ message: 'User logged in successfully', token: 'dummy-token' });
});

module.exports = router;
