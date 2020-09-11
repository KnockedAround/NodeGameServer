// This represents the client
// This object will be used to keep track of the clients data


// import performance now -- allows for detailed and precise timers
var now = require('performance-now');

// import underscore -- filtering library for data and organization
var _ = require('underscore');


module.exports = function() {
    // These objects will be added at runtime...
    // this.socket = {};
    // this.user = {};
    var client = this;
    

    // initialization
    this.initiate = function() {
        
        // send the connection handshake packet to the client
        client.socket.write(packet.build(["HELLO", now().toString()]))

        console.log('client initiated...');
    };

    // client methods
    this.enterRoom = function(selected_room) {
        // The client doesn't exist on the first pass, and the buffer is being written to with 
        // invalid data, will address this in the future

        // console.log(client);
        // Array.from(maps[selected_room].connected_clients).forEach(function(otherClient) {
        //     otherClient.socket.write(packet.build([
        //         "ENTER",
        //         client.username,
        //         client.user.position_x,
        //         client.user.position_y
        //     ]));
        // });
        maps[selected_room].connected_clients.push(client)
        // debug
        console.log(maps[selected_room].connected_clients.push(client));
    };

    this.broadcastRoom = function(packet_data) {
        // debug
        console.log(maps[client.user.current_room].connected_clients);

        maps[client.user.current_room].connected_clients.forEach(function(otherClient) {
            if (otherClient.user.username != client.user.username)
            {
                otherClient.socket.write(packet_data);
            };
        });
    }

    // data handlers
    this.data = function(data) {
        console.log('Client Data: ' + data);
        packet.parse(client, data);
    }

    this.end = function() {
        console.log('Client Closed...');
    }

    this.error = function(err) {
        console.log('Client Error: ' + err.toString());
    }

    
}