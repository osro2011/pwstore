"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.Options = exports.Packet = exports.Attributes = exports.Codes = void 0;
const dgram_1 = __importDefault(require("dgram"));
const radius_1 = __importDefault(require("radius"));
var Codes;
(function (Codes) {
    Codes["accessRequest"] = "Access-Request";
    Codes["accessAccept"] = "Access-Accept";
})(Codes = exports.Codes || (exports.Codes = {}));
var Attributes;
(function (Attributes) {
    Attributes["username"] = "User-Name";
    Attributes["password"] = "User-Password";
})(Attributes = exports.Attributes || (exports.Attributes = {}));
class Packet {
    constructor(code, secret, attribures = [], identifier = Math.floor(Math.random() * (255))) {
        this.code = code;
        this.secret = secret;
        this.identifier = identifier;
        this.attributes = attribures;
    }
}
exports.Packet = Packet;
class Options {
    constructor(host = '127.0.0.1', port = 1812, localPort = getEphemeralPort(), timeout = 2500) {
        this.host = host;
        this.port = port;
        this.localPort = localPort;
        this.timeout = timeout;
    }
}
exports.Options = Options;
function send(packet, options, callback) {
    // Add dictionary if provided
    if (options.dictionaryPath != null) {
        radius_1.default.add_dictionary(options.dictionaryPath);
    }
    let t = setTimeout(() => {
        if (socket)
            socket.close();
        console.log('ETIMEDOUT');
        // Se till att den är retryable?
        let err = new Error('ETIMEDOUT');
        return callback(err);
    }, options.timeout);
    // Create new socket
    let socket = dgram_1.default.createSocket('udp4');
    // Declare encoded packet variable
    let encPacket;
    // Encode packet
    try {
        encPacket = radius_1.default.encode(packet);
    }
    catch (err) {
        console.log('Failed to encode packet');
        return callback(err);
    }
    // Error handling
    socket.on('error', function (err) {
        return callback(err);
    });
    socket.on('message', (msg, rinfo) => {
        console.log(rinfo);
        // Closing socket since we don't need it anymore
        socket.close();
        // Decode and verify RADIUS response
        let response;
        try {
            response = radius_1.default.decode({ packet: msg, secret: "secret" });
            console.log('Decoded RADIUS response');
        }
        catch (err) {
            return callback(err);
        }
        let isValid = radius_1.default.verify_response({
            response: msg,
            request: encPacket,
            secret: packet.secret
        });
        console.log(isValid ? 'valid response' : 'invalid response');
        if (!isValid)
            return callback(new Error('RADIUS response is invalid'));
        callback(null, response);
        clearTimeout(t);
    });
    socket.on('listening', () => {
        console.log('Listening on port %s...', options.localPort);
        socket.send(encPacket, 0, encPacket.length, options.port, options.host, function (err, bytes) {
            if (err)
                return callback(err);
            console.log('Sent %s bytes to %s:%s', bytes, options.host, options.port);
        });
    });
    socket.bind(options.localPort, options.host);
}
exports.send = send;
function getEphemeralPort() {
    let begin = 49152;
    let end = 65535;
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}
