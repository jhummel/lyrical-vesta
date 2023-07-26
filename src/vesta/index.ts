import { getChar } from '../utils/characters';
import { logger } from '../logger';

// export const VESTA_URL = 'http://192.168.1.215:7000/local-api/message';
export const VESTA_URL = 'https://rw.vestaboard.com';
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

export function getVestaFormattedWords(words: string[]): number[][] {
  return words.map((word) => getVestaFormattedChars(word));
}

export function padLines(lines: number[][]): number[][] {
  return lines.map((line) => {
    const { length } = line;
    if (length < COLUMNS) { return line.concat(new Array(COLUMNS - length).fill(0)); }

    return [...line];
  });
}

export function chunkWordsToLines(wordArr: number[][]): number[][][] {
  const accumulator: number[][][] = [[]];
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
  }, accumulator);
}

export function combineWordsToLines(lines: number[][][]): number[][] {
  return lines.map((line) => line.reduce((acc, word) => {
    const w = (acc.length === 0) ? word : [0, ...word];
    return acc.concat(w);
  }, []));
}

export function addFullVestaLines(lines: number[][]): number[][] {
  if (lines.length > ROWS) throw new Error('Too many lines for display');
  let i = lines.length;

  while (i < ROWS) {
    const empty = new Array(COLUMNS).fill(0);
    if (i % 2 === 0) lines.unshift(empty);
    else lines.push(empty);
    i += 1;
  }

  return lines;
}

export function getVestaFormattedLines(message: string): number[][] {
  if (message.length > COLUMNS * ROWS) throw new Error('String is too long for display');

  const words = message.split(' ');
  const wordArr = getVestaFormattedWords(words);
  const m = chunkWordsToLines(wordArr);
  const l = combineWordsToLines(m);
  return padLines(l);
}

export class Vestaboard {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  async sendMessage(message: string): Promise<any> {
    logger.debug('New message received to vesta board: ', message);
    const condencedVestaMessage = getVestaFormattedLines(message);
    const vestaMessage = addFullVestaLines(condencedVestaMessage);

    return fetch(VESTA_URL, {
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
