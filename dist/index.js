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
// import cron from 'node-cron';
const dotenv = __importStar(require("dotenv"));
const lyrical_1 = require("./lyrical");
const vesta_1 = require("./vesta");
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
console.log(process.env);
const { VESTA_API_KEY = '' } = process.env;
const vesta = new vesta_1.Vestaboard(VESTA_API_KEY);
lyrical_1.LyricalSystems.getCurrentSongForRandomPlayer()
    .then(async (player) => {
    if (player) {
        const response = await vesta.sendMessage(`Room ${player.room}: ${player.song.title} by ${player.song.artist}`);
        console.log(response);
    }
});
//# sourceMappingURL=index.js.map