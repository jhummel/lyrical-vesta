"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const COLUMNS = 22;
const ROWS = 6;
const CHARS = ` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$()\\-\\+&=;:\\'"%,.\\\\/?`;
const charArray = CHARS.split('').map((char, idx) => {
    if (char !== '\\')
        return [char, idx];
}).filter(c => c);
const CHAR_MAP = new Map(charArray);
function getVestaFormattedWord(word) {
    return word.split('').map(char => {
        if (CHAR_MAP.has(char.toUpperCase())) {
            return CHAR_MAP.get(char.toUpperCase());
        }
        else {
            // If it's a non-supported
            // character we return a space
            return 0;
        }
    });
}
// Return a 2D array representing the Vesta
// Layout.
function getVestaFormatedLines(words) {
    const lines = words.reduce((acc, word, idx, arr) => {
        const vestaWord = getVestaFormattedWord(word).concat([0]);
        console.log(vestaWord);
        return acc;
        /*
        const row = acc.length;
  
        if(acc[row-1].length + chars.length > COLUMNS) {
        const remainder = COLUMNS - acc[row - 1].length;
        acc[row - 1] = acc[row - 1].concat(Array(remainder).fill(0))
        acc[row] = chars;
      } else {
        acc[row-1] = acc[row-1].concat(chars)
      }
      return acc;
      */
    }, [[]]);
}
//# sourceMappingURL=index.js.map