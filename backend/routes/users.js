const express = require('express');
const router = express.Router();

// In-memory JSON data
let users = [
  { id: 1, username: 'john_doe' },
];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Add a new user
router.post('/', (req, res) => {
  const newUser = req.body;
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;
