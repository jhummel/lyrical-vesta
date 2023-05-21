import { getChar } from '../utils/characters';

export const COLUMNS = 22;
export const ROWS = 6;

export function getVestaFormattedChars(message: string): number[] {
  if (!message.length) throw new Error('Empty string cannot be formatted as a Vestaboard word');
  return message.split('').map((c) => getChar(c));
}

type RecursiveArray = Array<RecursiveArray | number>;
function findNestedLength(arr: RecursiveArray): number {
  return arr.flat(3).length;
}

export function chunkWordsToLines(wordArr: number[][]): number[][][] {
  const lines: number[][][] = [[]];
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

    if (l + word.length + (last.length) > COLUMNS) {
      acc.push([word]);
    } else {
      last.push(word);
    }

    return acc;
  }, lines);
}

function combineWordsToLines(lines: number[][][]): number[][] {
  return lines.map((line) => line.reduce((acc, word) => {
    const w = (acc.length === 0) ? word : [0, ...word];
    return acc.concat(w);
  }, []));
}

export function getVestaFormattedLines(message: string): number[][] {
  if (message.length > COLUMNS * ROWS) throw new Error('String is too long for display');

  const words = message.split(' ');
  const wordArr = words.map((word) => getVestaFormattedChars(word));
  const m = chunkWordsToLines(wordArr);
  return combineWordsToLines(m);
}
