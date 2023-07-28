"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vestaboard = exports.getVestaFormattedLines = exports.addFullVestaLines = exports.combineWordsToLines = exports.chunkWordsToLines = exports.padLines = exports.getVestaFormattedWords = exports.getVestaFormattedChars = exports.ROWS = exports.COLUMNS = exports.VESTA_URL = void 0;
const characters_1 = require("../utils/characters");
const logger_1 = require("../logger");
// export const VESTA_URL = 'http://192.168.1.215:7000/local-api/message';
exports.VESTA_URL = 'https://rw.vestaboard.com';
exports.COLUMNS = 22;
exports.ROWS = 6;
function getVestaFormattedChars(message) {
    if (!message.length)
        throw new Error('Empty string cannot be formatted as a Vestaboard word');
    return message.split('').map((c) => (0, characters_1.getChar)(c));
}
exports.getVestaFormattedChars = getVestaFormattedChars;
function findNestedLength(arr) {
    return arr.flat(3).length;
}
function getVestaFormattedWords(words) {
    return words.map((word) => getVestaFormattedChars(word));
}
exports.getVestaFormattedWords = getVestaFormattedWords;
function padLines(lines) {
    return lines.map((line) => {
        const { length } = line;
        if (length < exports.COLUMNS) {
            return line.concat(new Array(exports.COLUMNS - length).fill(0));
        }
        return [...line];
    });
}
exports.padLines = padLines;
function chunkWordsToLines(wordArr) {
    const accumulator = [[]];
    /* [
        [
          [1,2,3],
          [1,2,3]
        ],[
          [1,2 3]
        ]
      ] */
    return wordArr.reduce((acc, word) => {
        const last = acc[acc.length - 1];
        const l = findNestedLength(last);
        if (l + word.length + (last.length) > exports.COLUMNS) {
            acc.push([word]);
        }
        else {
            last.push(word);
        }
        return acc;
    }, accumulator);
}
exports.chunkWordsToLines = chunkWordsToLines;
function combineWordsToLines(lines) {
    return lines.map((line) => line.reduce((acc, word) => {
        const w = (acc.length === 0) ? word : [0, ...word];
        return acc.concat(w);
    }, []));
}
exports.combineWordsToLines = combineWordsToLines;
function addFullVestaLines(lines) {
    if (lines.length > exports.ROWS)
        throw new Error('Too many lines for display');
    let i = lines.length;
    while (i < exports.ROWS) {
        const empty = new Array(exports.COLUMNS).fill(0);
        if (i % 2 === 0)
            lines.unshift(empty);
        else
            lines.push(empty);
        i += 1;
    }
    return lines;
}
exports.addFullVestaLines = addFullVestaLines;
function getVestaFormattedLines(message) {
    if (message.length > exports.COLUMNS * exports.ROWS)
        throw new Error('String is too long for display');
    const words = message.split(' ');
    const wordArr = getVestaFormattedWords(words);
    const m = chunkWordsToLines(wordArr);
    const l = combineWordsToLines(m);
    return padLines(l);
}
exports.getVestaFormattedLines = getVestaFormattedLines;
class Vestaboard {
    key;
    constructor(key) {
        this.key = key;
    }
    async sendMessage(message) {
        logger_1.logger.debug('New message received to vesta board: ', message);
        const condencedVestaMessage = getVestaFormattedLines(message);
        const vestaMessage = addFullVestaLines(condencedVestaMessage);
        return fetch(exports.VESTA_URL, {
            body: JSON.stringify(vestaMessage),
            headers: {
                'X-Vestaboard-Read-Write-Key': this.key,
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(async (res) => {
            if (res.ok) {
                return res.json();
            }
            throw await res.json();
        });
    }
}
exports.Vestaboard = Vestaboard;
//# sourceMappingURL=index.js.map