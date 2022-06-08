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
    options.dictionaryPath = "/home/banan/Programmering/ts/pwstore/dictionary"
    
    let un: radiusHelper.Attribute = [radiusHelper.Attributes.username, username];
    let pw: radiusHelper.Attribute = [radiusHelper.Attributes.password, password];
    
    packet.attributes.push(un);
    packet.attributes.push(pw);
    
    radiusHelper.send(packet, options, (err: unknown, response: radius.RadiusPacket) => {
        if (err) {
            console.log("ERROR: " + err);
        }
        if (response.code === radiusHelper.Codes.accessReject) {
            console.log('Invalid User');
            return;
        }
        /*
        tbl.pw
        DOMAIN | REQ_PERMS | PW
        secore.enable.telianet | secore_RW | pass

        select * from tbl.pw where domain=in_domain
        return row?
        if Attr.Class === REQ_PERMS: 
            return pass;
        else:
            log deny
        */
    });
}