const COLUMNS = 22;
const ROWS = 6;
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$()\\-\\+&=;:\\\'"%,.\\\\/?';

type charTuple = [string, number]

function isChar(c: charTuple | undefined): c is charTuple {
  return c !== undefined;
}

function mapChars(char: string, idx: number) : [string, number] | undefined {
  if (char !== '\\') return [char, idx];
  return undefined;
}

const charArray = CHARS.split('').map(mapChars).filter(isChar);

const CHAR_MAP = new Map(charArray);

function getVestaFormattedWord(word) {
  return word.split('').map((char) => {
    if (CHAR_MAP.has(char.toUpperCase())) {
      return CHAR_MAP.get(char.toUpperCase());
    }
    // If it's a non-supported
    // character we return a space
    return 0;
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
