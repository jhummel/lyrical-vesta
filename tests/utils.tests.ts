import { expect} from "chai";
import { getChar } from "../src/utils/characters" 


// https://docs.vestaboard.com/characters

describe("Utility tests", () => {
  it("should return a number for different characters", () => {
    expect(getChar('a')).to.eql(1)
  });

  it("should only allow a single character", () => {
    expect(getChar.bind(null, 'abc')).to.throw('Only single characters may be passed to getChar. You passed "abc"');
  })

  it("should not allow emoji", () => {
    expect(getChar.bind(null, '😀')).to.throw('Only single characters may be passed to getChar. You passed "😀"')
  })

  it("should not allow characters outside the map", () => {
    expect(getChar.bind(null, '`')).to.throw('Vestaboard does not support the character "`"')
  })
});