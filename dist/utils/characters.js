"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChar = void 0;
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$()\\-\\+&=;:\\\'"%,.\\\\/?';
function isChar(c) {
    return c !== undefined;
}
function mapChars(char, idx) {
    if (char !== '\\')
        return [char, idx];
    return undefined;
}
const charArray = CHARS.split('').map(mapChars).filter(isChar);
const CHAR_MAP = new Map(charArray);
function getChar(c) {
    if (c.length > 1)
        throw new Error(`Only single characters may be passed to getChar. You passed "${c}"`);
    const n = CHAR_MAP.get(c.toUpperCase());
    if (n === undefined)
        throw new Error(`Vestaboard does not support the character "${c}"`);
    return n;
}
exports.getChar = getChar;
//# sourceMappingURL=characters.js.map