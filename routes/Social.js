const express = require('express')
const router = express.Router()
const utils = require('../utils/utils')
const User = require('../models/user'); // Import the user model from user.js

router.post('/addFriend', async (req, res) => {
    try {
        const { self, usernameToAdd } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToAdd = await User.findOne({ username: usernameToAdd })
        if (!user || !userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.id == userToAdd.id) {
            return res.status(400).json({ message: 'Cannot add yourself' });
        }
        // user.friends.push({ userId: userToAdd._id });
        if (userToAdd.friends.length > 0) {
            for (let i = 0; i < userToAdd.friends.length; i++) {
                const elem = userToAdd.friends[i];
                if (!elem.userId.equals(user._id)) {
                    continue;
                }
                else {
                    return res.status(200).json({ message: `Request status ${elem.status}` });
                }
            }
            userToAdd.friends.push({ userId: user._id });
            userToAdd.save();
            return res.status(200).json({ message: 'Request sent successfully' });
        } else {
            userToAdd.friends.push({ userId: user._id });
            await userToAdd.save();
            return res.status(200).json({ message: 'Request sent successfully' });
        }
        // await user.save();
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
});
router.post('/acceptFriendRequest', async (req, res) => {
    try {
        const { self, usernameToAdd } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToAdd = await User.findOne({ username: usernameToAdd })
        if (!user || !userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.id == userToAdd.id) {
            return res.status(400).json({ message: 'Cannot add yourself' });
        }
        user.friends.forEach((elem) => {
            if ((elem.userId.equals(userToAdd._id)) && (elem.status == "pending")) {
                elem.status = "accepted";
                userToAdd.friends.push({ "userId": user._id, status: "accepted" })
            }
        });
        await user.save();
        await userToAdd.save();
        return res.status(200).json({ message: 'Request accepted successfully' });
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
})
router.post('/cancelFriendRequest', async (req, res) => {
    try {
        const { self, usernameToRemove } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToRemove = await User.findOne({ username: usernameToRemove })
        if (!user || !userToRemove) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.id == userToRemove.id) {
            return res.status(400).json({ message: 'Cannot Remove Yourself' });
        }
        user.friends.forEach((elem) => {
            if ((elem.userId.equals(userToRemove._id)) && (elem.status == "pending")) {
                user.friends.pop(elem);
            }
        });
        user.save();
        return res.status(200).json({ message: 'Request Removed Successfully' });
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
})
router.post('/deleteFriend', async (req, res) => {
    try {
        const { self, usernameToDelete } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToDelete = await User.findOne({ username: usernameToDelete })
        if (!user || !userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.friends.forEach((elem) => {
            if ((elem.userId.equals(userToDelete._id)) && (elem.status == "accepted")) {
                user.friends.pop(elem);
            }
        });
        user.save();
        return res.status(200).json({ message: 'Friend Removed Successfully' });
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
})
router.post('/blockUser', async (req, res) => {
    try {
        const { self, username } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToBlock = await User.findOne({ username: username })
        if(self == username){
            return res.status(200).json({ message: 'Cant block yourself' });
        }
        for (let i = 0; i < user.friends.length; i++) {
            const friend = user.friends[i];
            if (friend.userId.equals(userToBlock.id)) {
                if (friend.status == "accepted") {
                    friend.status = "blocked";
                    await user.save();
                    return res.status(200).json({ message: 'User blocked' });
                } else if (friend.status == "pending") {
                    friend.status = "blocked";
                    await user.save();
                    return res.status(200).json({ message: 'User blocked' });
                } else if (friend.status == "blocked") {
                    return res.status(200).json({ message: 'User already blocked' });
                }
            }
        }
        user.friends.push({ "userId": user._id, status: "blocked" })
        await user.save();
        return res.status(200).json({ message: 'User blocked' });
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
});
router.post('/unblockUser', async (req, res) => {
    try {
        const { self, username } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: self })
        const userToUnblock = await User.findOne({ username: username })
        if(self == username){
            return res.status(400).json({ message: 'Cant unblock yourself' });
        }
        for (let i = 0; i < user.friends.length; i++) {
            const friend = user.friends[i];
            if (friend.userId.equals(userToUnblock.id)) {
                if (friend.status == "blocked") {
                    user.friends.pop(friend);
                    await user.save();
                    return res.status(200).json({ message: 'User removed from blocklist' });
                }
            }
        }
        return res.status(200).json({ message: 'Cant unblock' });

    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
});
router.get('/searchUser', async (req, res) => {
    try {
        const { self, username } = req.body;
        const userToFind = await User.findOne({ username: username })
        if (self == username) {
            return res.status(404).json({ exists: false });
        }
        else if (!userToFind) {
            return res.status(404).json({ exists: false });
        }
        else {
            var blocklist = utils.filterFriends(userToFind.friends, "blocked")
            var blockedusers = await utils.getUsernamesByIDs(blocklist);
            if (blockedusers.includes(self)) {
                return res.status(404).json({ exists: false });
            } else {
                return res.status(200).json({ exists: true });
            }
        }
    }
    catch {
        return res.status(500).json({ message: 'Internal Server Error' });
    };
})
router.get('/getFriends', (req, res) => {
    const { username } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            var friendslist = utils.filterFriends(user.friends, "accepted")
            var friendsUsername = await utils.getUsernamesByIDs(friendslist);
            console.log(friendsUsername);
            return res.status(200).json({ "firends": friendsUsername });
        })
        .catch((findErr) => {
            console.error('Error finding user:', findErr);
            return res.status(500).json({ message: 'Internal Server message' });
        });
});
router.get('/getFriendRequests', (req, res) => {
    const { username } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            var friendslist = utils.filterFriends(user.friends, "pending")
            var requestsUsernames = await utils.getUsernamesByIDs(friendslist);
            return res.status(200).json({ "requests": requestsUsernames });
        })
        .catch((findErr) => {
            console.error('Error finding user:', findErr);
            return res.status(500).json({ message: 'Internal Server message' });
        });
});
router.get('/getBlocklist', (req, res) => {
    const { username } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            var blocklist = utils.filterFriends(user.friends, "blocked")
            var blockedusers = await utils.getUsernamesByIDs(blocklist);
            return res.status(200).json({ "blocked": blockedusers });
        })
        .catch((findErr) => {
            console.error('Error finding user:', findErr);
            return res.status(500).json({ message: 'Internal Server message' });
        });
});
module.exports = router;
