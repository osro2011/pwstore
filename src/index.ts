#!/usr/bin/env node

import { Command } from "commander";
import * as radiusHelper from "./radius_helper";
import radius from "radius";

const program = new Command();
program
    .arguments('<username> <password> <domain>')
    .action((username, password, domain) => {
        run(username, password, domain)
    });

program.parse();

function run(username: string, password: string, domain: string): void {
    let packet: radiusHelper.Packet = new radiusHelper.Packet(radiusHelper.Codes.accessRequest, "secret");
    let options: radiusHelper.Options = new radiusHelper.Options;
    options.dictionaryPath = "./dictionary"
    
    let un: radiusHelper.Attribute = [radiusHelper.Attributes.username, username];
    let pw: radiusHelper.Attribute = [radiusHelper.Attributes.password, password];
    
    packet.attributes.push(un);
    packet.attributes.push(pw);
    
    radiusHelper.send(packet, options, (err: unknown, response: radius.RadiusPacket) => {
        if (err) throw (err);
        if (response.code === radiusHelper.Codes.accessAccept && response.attributes.Class === domain) {
            console.log('Return password?');
        }
    });
}