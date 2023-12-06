const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');

const User = require('../models/user'); // Import the user model from user.js

// Registration
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        // Save the user to the database
        newUser.save()
            .then(() => {
                return res.status(201).json({ message: 'Registration successful' });
            })
            .catch((saveErr) => {
                console.error('Error saving user:', saveErr);
                return res.status(400).json({ error: 'Registration failed' });
            });

    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, user.password)
                .then((match) => {
                    if (!match) {
                        return res.status(401).json({ error: 'Invalid credentials' });
                    }

                    // Store user object in the session
                    req.session.user = user;

                    // Return the user object in the response
                    return res.status(200).json({ user });
                })
                .catch((compareErr) => {
                    console.error('Error comparing passwords:', compareErr);
                    return res.status(500).json({ error: 'Internal Server Error' });
                });
        })
        .catch((findErr) => {
            console.error('Error finding user:', findErr);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});
// GetUserProfile
router.post('/getFriends', (req, res) => {
    const { username } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json({"firends": user.friends});
        })
        .catch((findErr) => {
            console.error('Error finding user:', findErr);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});
module.exports = router;