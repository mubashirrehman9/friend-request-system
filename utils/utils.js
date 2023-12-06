const user = require('../models/user');
const User = require('../models/user'); // Import the user model from user.js


function filterFriends(arr, status) {
    var filteredFriends =arr.filter((friend) => {
        if (friend.status == status) {
            return friend;
        }
    })
    return filteredFriends;
}
async function getUsernameByID(id) {
    var user = await User.findById(id);
    if (user) {
        return user;
    }
    return null;
}
async function getUsernamesByIDs(ids) {
    var usernames = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i].userId;
        var user = await User.findById(id);
        if (user){
            usernames.push(user.username);
        }
    }
    return usernames;
}
module.exports = { filterFriends , getUsernameByID, getUsernamesByIDs};
