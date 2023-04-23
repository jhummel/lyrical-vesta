import { getChar } from '../utils/characters';
export const COLUMNS = 22;

function findAllSpaceIndexes(message: number[]): number[] {
  const indexes = []
  const SPACE_CHAR = getChar(' ');
  for(let i = 0; i < message.length; i++)
    if (message[i] === SPACE_CHAR) indexes.push(i);

  return indexes;
}

export function getVestaFormattedChars(message: string): number[] {
  if (!message.length) throw new Error('Empty string cannot be formatted as a Vestaboard word');
  return message.split('').map((c) => getChar(c));
}

export function getVestaFormattedLines(message: string): number[][] {
  const lines: number[][] = [];
  const vestaMessage = getVestaFormattedChars(message);
  const spaceIndexes = findAllSpaceIndexes(vestaMessage);

  let lineNum = 1;
  let start = 0;

  spaceIndexes.forEach((spaceIndex, index) => {
    if (spaceIndex * lineNum > COLUMNS) {
      const line = vestaMessage.slice(start, spaceIndexes[index - 1])

      lineNum++
      start = index;

      lines.push(line);
    }
  })

  return lines;
}
/*
function getVestaFormatedLines(words) {
  const lines = words.reduce((acc, word, idx, arr) => {
    const vestaWord = getVestaFormattedWord(word).concat([0]);
    console.log(vestaWord);
    return acc;
        const row = acc.length;

        if(acc[row-1].length + chars.length > COLUMNS) {
        const remainder = COLUMNS - acc[row - 1].length;
        acc[row - 1] = acc[row - 1].concat(Array(remainder).fill(0))
        acc[row] = chars;
      } else {
        acc[row-1] = acc[row-1].concat(chars)
      }
      return acc;
  }, [[]]);
}
*/
