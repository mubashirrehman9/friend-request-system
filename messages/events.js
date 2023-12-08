const utils = require('../utils/utils')
var playersLookup = {};
var sockets = [];

function IntializeSocketEvents(io) {
    io.on('connection', async (socket) => {
        console.log("User Connected " + socket.id);
        socket.on('setUserStatusOnline', async (username) => {
            await utils.setUserStatusOnline(username)
            sockets.push(socket.id);
            playersLookup[socket.id] = username;
            console.log(playersLookup);
        });
    });
}

module.exports = { IntializeSocketEvents };