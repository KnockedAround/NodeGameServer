
var Parser = require('binary-parser').Parser;

// GMS2 String represented as string, 0 terminated
// e.g: FFAD00<- terminator

var stringOptions = {
    length: 99,
    zeroTerminated: true
};

module.exports = packetModels = {
    header: new Parser()
        .skip(1)
        .string("command", stringOptions),

    login: new Parser()
        .skip(1)
        .string("command", stringOptions)
        .string("username", stringOptions)
        .string("password", stringOptions),

    register: new Parser()
        .skip(1)
        .string("command", stringOptions)
        .string("username", stringOptions)
        .string("password", stringOptions),

    pos: new Parser()
        .skip(1)
        .string("command", stringOptions)
        .int32le("target_x", stringOptions)
        .int32le("target_y", stringOptions)
    }
