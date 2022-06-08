import dgram from 'dgram';
import radius from 'radius';

export enum Codes {
    accessRequest = 'Access-Request',
    accessAccept = 'Access-Accept',
    accessReject = 'Access-Reject'
}

export enum Attributes {
    username = 'User-Name',
    password = 'User-Password'
}

export type Attribute = [Attributes, string];

interface IPacket {
    code: Codes;
    secret: string;
    identifier: number;
    attributes: Array<Attribute>;
}

export class Packet implements IPacket {
    code: Codes;
    secret: string;
    identifier: number;
    attributes: Array<Attribute>;
    
    constructor(
        code: Codes, 
        secret: string, 
        attribures: Array<Attribute> = [], 
        identifier: number = Math.floor(Math.random() * (255))
        ) {
        this.code = code;
        this.secret = secret;
        this.identifier = identifier;
        this.attributes = attribures;
    }
}

interface IOptions {
    dictionaryPath?: string;
    host: string;
    port: number;
    localPort: number;
    timeout: number;
}

export class Options implements IOptions {
    host: string;
    port: number;
    localPort: number;
    timeout: number;
    dictionaryPath?: string;
    
    constructor(
        host: string = '127.0.0.1', 
        port: number = 1812, 
        localPort: number = getEphemeralPort(),
        timeout: number = 2500
        ) {
        this.host = host;
        this.port = port;
        this.localPort = localPort;
        this.timeout = timeout;
    }
}

export function send(packet: Packet, options: Options, callback: Function) {
    // Add dictionary if provided
    if (options.dictionaryPath != null) {
        radius.add_dictionary(options.dictionaryPath);
    }

    let t = setTimeout(() => {
        if (socket) socket.close();
        console.log('ETIMEDOUT');

        // Se till att den är retryable?
        let err = new Error('ETIMEDOUT');

        return callback(err);
    }, options.timeout);

    // Create new socket
    let socket: dgram.Socket = dgram.createSocket('udp4');

    // Declare encoded packet variable
    let encPacket: Buffer;

    // Encode packet
    try {
        encPacket = radius.encode(packet);
    } catch (err) {
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
        let response: radius.RadiusPacket;

        try {
            response = radius.decode({ packet: msg, secret: "secret" });
            console.log('Decoded RADIUS response');
        } catch (err) {
            return callback(err);
        }

        let isValid = radius.verify_response({
            response: msg,
            request: encPacket,
            secret: packet.secret
        });

        console.log(isValid ? 'valid response' : 'invalid response');

        if (!isValid) return callback(new Error('RADIUS response is invalid'));

        callback(null, response);
        clearTimeout(t);
    });

    socket.on('listening', () => {
        console.log('Listening on port %s...', options.localPort)

        socket.send(encPacket, 0, encPacket.length, options.port, options.host, function (err, bytes) {
            if (err) return callback(err);
            console.log('Sent %s bytes to %s:%s', bytes, options.host, options.port);
        });
    });

    socket.bind(options.localPort, options.host);
}

function getEphemeralPort(): number {
    let begin: number = 49152;
    let end: number = 65535;

    return Math.floor(Math.random() * (end - begin + 1) + begin);
}