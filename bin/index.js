#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const radiusHelper = __importStar(require("./radius_helper"));
const program = new commander_1.Command();
program
    .arguments('<username> <password> <domain>')
    .action((username, password, domain) => {
    run(username, password, domain);
});
program.parse();
function run(username, password, domain) {
    let packet = new radiusHelper.Packet(radiusHelper.Codes.accessRequest, "secret");
    let options = new radiusHelper.Options;
    options.dictionaryPath = "./dictionary";
    let un = [radiusHelper.Attributes.username, username];
    let pw = [radiusHelper.Attributes.password, password];
    packet.attributes.push(un);
    packet.attributes.push(pw);
    radiusHelper.send(packet, options, (err, response) => {
        if (err)
            throw (err);
        console.log(response.code === radiusHelper.Codes.accessAccept);
        console.log(response.attributes.Class);
        console.log(response.attributes.Class === domain);
        if (response.code === radiusHelper.Codes.accessAccept && response.attributes.Class === domain) {
            console.log('Return password?');
        }
    });
}
