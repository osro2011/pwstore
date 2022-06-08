#!/usr/bin/env node

import { Command } from "commander";
import * as radiusHelper from "./radius_helper";
import radius from "radius";
import db, {Credentials} from './database';
import { exit } from "process";

const program = new Command();
program
    .arguments('<username> <password> <domain>')
    .action((username, password, domain) => {
        run(username, password, domain)
    });

program.parse();

async function run(username: string, password: string, domain: string) {
    let packet: radiusHelper.Packet = new radiusHelper.Packet(radiusHelper.Codes.accessRequest, "secret");
    let options: radiusHelper.Options = new radiusHelper.Options;
    options.dictionaryPath = "/home/banan/Programmering/ts/pwstore/dictionary"
    
    let un: radiusHelper.Attribute = [radiusHelper.Attributes.username, username];
    let pw: radiusHelper.Attribute = [radiusHelper.Attributes.password, password];
    
    packet.attributes.push(un);
    packet.attributes.push(pw);
    
    radiusHelper.send(packet, options, async (err: unknown, response: radius.RadiusPacket) => {
        if (err) {
            console.log("ERROR: " + err);
            return;
        }
        if (response.code === radiusHelper.Codes.accessReject) {
            console.log('Invalid User');
            return;
        }
        const perms = await getReqPerms(domain);
        // Vad händer om det finns flera klassattribut?
        if (response.attributes.Class === perms) {
            console.log(await getPassword(domain));
            return;
        } else {
            console.log("User lacks permissions")
            return;
        }
    });
    return;
}

async function getReqPerms (domain: string) {
    const creds = await Credentials(db).findOne({Domain: domain});
    return creds?.Req_Perms;
}

async function getPassword (domain: string) {
    const creds = await Credentials(db).findOne({Domain: domain});
    return creds?.Password;
}