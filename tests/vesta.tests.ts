import { expect} from "chai";
import { getVestaFormattedChars } from "../src/vesta" 

// https://docs.vestaboard.com/characters

describe("Character Tests", () => {
  it("should return a numbered array for a string", () => {
    expect(getVestaFormattedChars('hello world')).to.eql([
      8, 5, 12, 12, 15, 0, 23, 15, 18, 12, 4
    ])
  });

  it("should not allow an empty string as a word", () => {
    expect(getVestaFormattedChars.bind(null, '')).to.throw('Empty string cannot be formatted as a Vestaboard word')
  })
});