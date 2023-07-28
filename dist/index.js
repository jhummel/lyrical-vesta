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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = __importStar(require("node-cron"));
const dotenv = __importStar(require("dotenv"));
const logger_1 = require("./logger");
const vesta_1 = require("./vesta");
const lyrical_1 = require("./lyrical");
const prefix_json_1 = __importDefault(require("./prefix.json"));
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
const { VESTA_API_KEY = '', VESTA_CHANGE_DURATION_IN_MINUTES = 10 } = process.env;
logger_1.logger.info(`Vesta change duration is set to: ${VESTA_CHANGE_DURATION_IN_MINUTES}`);
cron.schedule(`*/${VESTA_CHANGE_DURATION_IN_MINUTES} * * * *`, () => {
    const vesta = new vesta_1.Vestaboard(VESTA_API_KEY);
    const rand = Math.floor(Math.random() * prefix_json_1.default.length);
    lyrical_1.LyricalSystems.getCurrentSongForRandomPlayer()
        .then(async (player) => {
        if (player) {
            vesta.sendMessage(`${prefix_json_1.default[rand]} Room ${player.room}: ${player.song.title} by ${player.song.artist}!`)
                .then((res) => logger_1.logger.info(res))
                .catch((err) => logger_1.logger.error(err));
        }
    });
});
//# sourceMappingURL=index.js.map