"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vestaboard = exports.getVestaFormattedLines = exports.chunkWordsToLines = exports.getVestaFormattedChars = exports.ROWS = exports.COLUMNS = exports.VESTA_URL = void 0;
const characters_1 = require("../utils/characters");
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
function chunkWordsToLines(wordArr) {
    const lines = [[]];
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
    }, lines);
}
exports.chunkWordsToLines = chunkWordsToLines;
function combineWordsToLines(lines) {
    return lines.map((line) => line.reduce((acc, word) => {
        const w = (acc.length === 0) ? word : [0, ...word];
        return acc.concat(w);
    }, []));
}
function getVestaFormattedLines(message) {
    if (message.length > exports.COLUMNS * exports.ROWS)
        throw new Error('String is too long for display');
    const words = message.split(' ');
    const wordArr = words.map((word) => getVestaFormattedChars(word));
    const m = chunkWordsToLines(wordArr);
    return combineWordsToLines(m);
}
exports.getVestaFormattedLines = getVestaFormattedLines;
class Vestaboard {
    key;
    constructor(key) {
        this.key = key;
    }
    async sendMessage(message) {
        const vestaMessage = getVestaFormattedLines(message);
        console.log('key: ', this.key);
        return fetch(exports.VESTA_URL, {
            body: JSON.stringify(vestaMessage),
            headers: {
                'Content-Type': 'application/json',
                'X-Vestaboard-Read-Write-Key': this.key,
            },
            method: 'POST',
        }).then((res) => res.json());
    }
}
exports.Vestaboard = Vestaboard;
//# sourceMappingURL=index.js.map