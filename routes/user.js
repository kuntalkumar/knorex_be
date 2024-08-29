const express = require('express');
const User = require('../models/User');

const router = express.Router();


// register route here the user listed on user table 
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
   // In future if need that i can put my hashed password here 
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// here in this route i can get all user
router.get('/alluser', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// here in can update my user by help of that particular id
router.put('/edit/:id', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    // if (email) user.email = email; // email i will not update 
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// here in this route i can delete a user by help of delete function

router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// export my router file to the index.js
module.exports = router;
