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

export function getChar(c: string): number {
  if (c.length > 1) throw new Error(`Only single characters may be passed to getChar. You passed "${c}"`);

  const n = CHAR_MAP.get(c.toUpperCase());
  if (n === undefined) throw new Error(`Vestaboard does not support the character "${c}"`);

  return n;
}