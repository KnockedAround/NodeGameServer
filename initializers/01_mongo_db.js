var mongoose = require('mongoose');

var mongooseOptions = 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    };

module.exports = game_db = mongoose.createConnection(config.database, mongooseOptions);
