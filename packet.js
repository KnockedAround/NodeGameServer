// reflects the packet that is used in Game Maker Studio
var zeroBuffer = new Buffer("00", "hex");


module.exports = packet = {
    // params: an array of javascript objects to be turned into buffers
    build: function(params) {
        var packetParts = [];
        var packetSize = 0;

        params.forEach(function(param) {
            var buffer;

            if (typeof param === 'string') {
                buffer = new Buffer(param, 'utf8');
                
                // buffer in GMS2 is read in hex
                // e.g: A, B, C 
                // e.g: FF, FF, FF, 00 -- 00 is the termination indicator,
                // this known as the zero buffer (defined above);

                // we have to add the termination buffer to the current 
                // variable length string buffer:
                // we join the buffer with the zero buffer, and for the length
                // argument we take the buffers length and add 1 byte to it
                // to account for the zeroBuffer
                buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
            }
            else if (typeof param === 'number') {
                buffer = new Buffer(2); // 2 bytes (16 bits) in size, unsigned int16

                // use the write unsigned int16 little endian format
                buffer.writeUInt16LE(param, 0);
            }
            else {
                // Some unknown type has been introduced... 
                // address implementation details or account for the new types,
                // for the time being just console log that this was encountered
                // on the server so that it can be address at some point
                // in the future.
                console.log('WARNING: Unknown data type in packet builder!');
            }

            packetSize += buffer.length;
            packetParts.push(buffer)
        });

        // create and build the packet
        var dataBuffer = Buffer.concat(packetParts, packetSize);

        // Data format for the packet
        // SIZE -> DATA 
        var size = new Buffer(1);
        size.writeUInt8(dataBuffer.length + 1, 0);

        var finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);
        
        return finalPacket;
    },
    // Parse a packet to be handled for a client
    parse: function(client, data_buffer) {
        var index = 0;

        while(index < data_buffer.length)
        {
            // extract size
            var packetSize = data_buffer.readUInt8(index);
            var extractedPacketBuffer = new Buffer(packetSize);
            data_buffer.copy(extractedPacketBuffer, 0, index, index + packetSize);

            this.interpret(client, extractedPacketBuffer);

            index += packetSize;
        }
    },

    interpret: function(client, data_buffer) {
        var header = packetModels.header.parse(data_buffer);

        console.log("Interpret: " + header.command);

        switch(header.command.toUpperCase())
        {
            case "LOGIN":
                var data = packetModels.login.parse(data_buffer);
                User.login(data.username, data.password, function(result, user){
                    console.log('Login result: ' + result);
                    console.log('User: ' + user);
                    if(result)
                    {
                        client.user = user;
                        client.enterRoom(client.user.current_room);
                        client.socket.write(packet.build([
                            "LOGIN",
                            "TRUE",
                            client.user.current_room,
                            client.user.position_x,
                            client.user.position_y,
                            client.user.username
                        ]));
                    }
                    else 
                    {
                        client.socket.write(packet.build([
                            "LOGIN",
                            "FALSE"
                        ]));
                    }
                });
                break;

            case "REGISTER":
                var data = packetModels.register.parse(data_buffer);
                User.register(data.username, data.password, function(result) {
                    if (result)
                    {
                        client.socket.write(packet.build([
                            "REGISTER",
                            "TRUE"
                        ]));
                    }
                    else 
                    {
                        client.socket.write(packet.build([
                            "REGISTER",
                            "FALSE"
                        ]));
                    }
                });
                break;

            case "POS":
                var data = packetModels.pos.parse(data_buffer);
                client.user.position_x = data.target_x;
                client.user.position_y = data.target_y;

                // refactor -- too many saves, move to log out function or on disconnect to save the user 
                // BUG Stream gets destroyed, causing errors with writing to the data base
                client.user.save();
                client.broadcastRoom(packet.build([
                    "POS",
                    client.user.username,
                    client.user.position_x,
                    client.user.position_y
                ]));

                console.log(data);
        }
    }
}