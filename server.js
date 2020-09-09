// import required libraries
require(__dirname + '/resources/config.js');
require('./packet.js'); // require the packet (global scope)
var fs = require('fs'); // file system
var network = require('net'); // networking

// uncomment to test config var export
// console.log(config.database);


// boot sequence
// 1. Load Intitializers
var init_files = fs.readdirSync(__dirname + "/initializers");
init_files.forEach(function(initFile) {
    console.log('Loading Initializer: ' + initFile);
    require(__dirname + "/initializers/" + initFile);
});

// 2. Load Data Models
var data_model_files = fs.readdirSync(__dirname + "/models");
data_model_files.forEach(function(dataModelFile) {
    console.log('Loading Data Model: ' + dataModelFile);
    require(__dirname + "/models/" + dataModelFile);
});

// 3. Load Game Maps Data (i.e: Resources dir)
maps = {}; // global

var map_files = fs.readdirSync(config.data_paths.maps);
map_files.forEach(function(mapFile) {
    console.log('Loading Map: ' + mapFile);
    var map = require(config.data_paths.maps + mapFile);
    maps[map.room] = map;
});

// uncomment to debug maps variable
// console.log(maps);
console.log("Initialize Completed...");

// 4. Intitiate server and listen - only fires on connection (once)
// default event is 'connect'
network.createServer(function(socket) {
    console.log('Socket Connected...');
    
    // create client instance
    var client_instance = new require('./client.js'); // this is only a reference (instance of the file)
    var thisClient = new client_instance(); // this is the actual client (from the reference of the file);

    // specific client now knows about its own socket
    thisClient.socket = socket;
    thisClient.initiate();

    // The functions below are abstracted away by the client.js object
    // This allows the client object to handle the events without bloating 
    // the server.

    // on error, do things to handle err 
    socket.on('error', thisClient.error);

    // on disconnect, do things to handle disconnect
    socket.on('end', thisClient.end);

    // on incoming data, do things to handle incoming data
    socket.on('data', thisClient.data);
}).listen(config.port);

console.log("Server Running On Port: " + config.port);
console.log("Environment Setting: " + config.environment);