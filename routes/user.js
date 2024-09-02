const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register route to add a new user to the user table
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // You can hash the password here if needed in the future
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all users with optional sorting, filtering, and searching
router.get('/alluser', async (req, res) => {
  try {
    // Extract query parameters for sorting, filtering, and searching
    const { sortBy, order = 'asc', firstName, lastName, email, search } = req.query;

    // Initialize filter and sort objects
    let filter = {};
    let sort = {};

    // Filtering logic
    if (firstName) filter.firstName = firstName;
    if (lastName) filter.lastName = lastName;
    if (email) filter.email = email;

    // Case-insensitive search logic (using regex)
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    // Sorting logic
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }

    // Fetch filtered, sorted, and searched users
    const users = await User.find(filter).sort(sort);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to update a user by their ID
router.put('/edit/:id', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    // Uncomment the line below if you want to allow updating the email
    // if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete a user by their ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router for use in index.js
module.exports = router;
