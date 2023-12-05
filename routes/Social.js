const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user'); // Import the user model from user.js

router.post('/addFriend', async (req, res) => {
    try {
        const { self, usernameToAdd } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToAdd = await User.findOne({ username: usernameToAdd })
        if (!user || !userToAdd) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.id == userToAdd.id) {
            return res.status(400).json({ error: 'Cannot add yourself' });
        }
        // user.friends.push({ userId: userToAdd._id });
        if (userToAdd.friends.length > 0) {
            for (let i = 0; i < userToAdd.friends.length; i++) {
                const elem = userToAdd.friends[i];
                if (!elem.userId.equals(user._id)) {
                    continue;
                } 
                else {
                    return res.status(200).json({ success: `Request status ${elem.status}` });
                }
            }            
            userToAdd.friends.push({ userId: user._id });
            userToAdd.save();
            return res.status(200).json({ success: 'Request sent successfully' });      
        } else {
            userToAdd.friends.push({ userId: user._id });
            await userToAdd.save();
            return res.status(200).json({ success: 'Request sent successfully' });
        }
        // await user.save();
    }
    catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

router.post('/acceptFriendRequest', async (req, res) => {
    try {
        const { self, usernameToAdd } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToAdd = await User.findOne({ username: usernameToAdd })
        if (!user || !userToAdd) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.id == userToAdd.id) {
            return res.status(400).json({ error: 'Cannot add yourself' });
        }
        user.friends.forEach((elem) => {
            if ((elem.userId.equals(userToAdd._id)) && (elem.status == "pending")) {
                elem.status = "accepted";
                userToAdd.friends.push({ "userId": user._id, status: "accepted" })
            }
        });
        await user.save();
        await userToAdd.save();
        return res.status(200).json({ success: 'Request accepted successfully' });
    }
    catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    };
})

router.post('/cancelFriendRequest', async (req, res) => {
    try {
        const { self, usernameToRemove } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToRemove = await User.findOne({ username: usernameToRemove })
        if (!user || !userToRemove) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.id == userToRemove.id) {
            return res.status(400).json({ error: 'Cannot Remove Yourself' });
        }
        user.friends.forEach((elem) => {
            if ((elem.userId.equals(userToRemove._id)) && (elem.status == "pending")) {
                user.friends.pop(elem);
            }
        });
        user.save();
        return res.status(200).json({ success: 'Request Removed Successfully' });
    }
    catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    };
})

module.exports = router;
