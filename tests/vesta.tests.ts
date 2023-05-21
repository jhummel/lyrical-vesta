import { expect} from "chai";
import {
  COLUMNS,
  ROWS,
  getVestaFormattedChars,
  getVestaFormattedLines
} from "../src/vesta" 

// https://docs.vestaboard.com/characters

function createStringWithSpaces(size = COLUMNS, char = 'a'): string {
  const arr = new Array(size)
  return arr.fill(char).map((c, i, a) => ( (i && i !== a.length - 1 && i % 6 === 0) ? ' ' : c )).join('');
}

const hello_world = [8, 5, 12, 12, 15, 0, 23, 15, 18, 12, 4];
const random = createStringWithSpaces(COLUMNS + 1);
const randomLong = createStringWithSpaces(COLUMNS * ROWS + 1);

describe("Vesta Tests", () => {
  it("should return a numbered array for a string", () => {
    expect(getVestaFormattedChars('hello world')).to.eql(hello_world)
  });

  it("should not allow an empty string as a word", () => {
    expect(getVestaFormattedChars.bind(null, '')).to.throw('Empty string cannot be formatted as a Vestaboard word')
  });

  it("should keep short messages on a single line", () => {
    expect(getVestaFormattedLines("Hello World")).to.eql([hello_world])
  });

  it("should split long messages into multiple lines", () => {
    expect(getVestaFormattedLines(random).length).to.equal(2)
  });

  it("should not allow messages that are too long", () => {
    expect(getVestaFormattedLines.bind(null, randomLong)).to.throw('String is too long for display')
  })
});