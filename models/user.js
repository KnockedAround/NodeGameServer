var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,

    sprite: String,

    current_room: String,

    position_x: Number,
    position_y: Number,
});

userSchema.statics.register = function(
    username,
    password,
    callback
) {
    var new_user = new User({
        username: username,
        password: password,
        
        sprite: "spr_hero",

        current_room: maps[config.starting_zone].room,

        position_x: maps[config.starting_zone].start_x,
        position_y: maps[config.starting_zone].start_y
    });

    new_user.save(function(err) {
        if (!err)
            callback(true);
        else 
            callback(false);
    });

};

userSchema.statics.login = function(
    username,
    password,
    callback
) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (!err && user)
        {
            if (user.password == password) 
            {
                callback(true, user);
            }
            else 
            {
                callback(false, null);
            }
        }
        else 
        {
            callback(false, null);
        }
    });
};

module.exports = User = game_db.model('User', userSchema);