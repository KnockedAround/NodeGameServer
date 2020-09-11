var mongoose = require('mongoose');

// var mongooseOptions = 
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     };

// remove options from connection for testing
module.exports = game_db = mongoose.createConnection(config.database);
