const utils = require('../utils/utils')
var playersLookup = {};
var sockets = [];

function IntializeSocketEvents(io) {
    io.on('connection', async (socket) => {
        console.log("User Connected " + socket.id);
        socket.on('setUserStatusOnline', async (username) => {
            var canLogin = true
            for (const [key, value] of Object.entries(playersLookup)) {
                if(value == username){
                    console.log(`${value} already logged in`);
                    socket.emit("logginFailed",{reason:"Player already logged in!"});
                    canLogin = false;
                    break;
                }
            }
            if(canLogin){
                console.log("Logging In...")
                await utils.setUserStatusOnline(username)
                sockets.push(socket.id);
                playersLookup[socket.id] = username;
            }
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