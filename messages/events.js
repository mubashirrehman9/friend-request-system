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
        });
        socket.on('inviteUser', async (self,username,conInfo) => {

        
        });
        socket.on("disconnect", async () => {
            if(playersLookup[socket.id]){
                await utils.setUserStatusOffline(playersLookup[socket.id])
                console.log("User " + (playersLookup[socket.id]) + "Disconnected" )
            }else{
                console.log("Client Disconnected" )
            }
        });
    });
}

module.exports = { IntializeSocketEvents };