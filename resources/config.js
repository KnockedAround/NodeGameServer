// game configuration

// accept incoming parameters into the application
// returns a function, which will take the arguments passed into the app, excluding the first two
var args = require('minimist')(process.argv.slice(2));

// extends objects with copy
var extend = require('extend');

// store environment variable
var environment = args.env || "test";

// uncomment to test args via console.log()
//console.log(environment);

// common configuration... e.g: name, version, max players... etc.
var common_conf = {
    name: "nodejs multiplayer server base",
    version: "0.0.1",
    environment: environment,
    max_players: 100,
    data_paths: {
        items: __dirname + '\\Game Data\\' + 'Items\\',
        maps: __dirname + '\\Game Data\\' + 'Maps\\',
    },
    starting_zone: "rm_test_town"
};

// environment specific configuration... e.g: server ip, port, db paths... etc.
var environment_conf = {
    production: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8081,
        database: "mongodb://localhost:27017/mp_server_base_prod_env"
    },
    test: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8082,
        database: "mongodb://127.0.0.1:27017/gms2_mp_base_test_env"
    },
    // others... etc, e.g: aplha_test.
};

// exntend environmenet_conf from common for export
extend(false, environment_conf.test, common_conf);
extend(false, environment_conf.production, common_conf);

module.exports = config = environment_conf[environment];