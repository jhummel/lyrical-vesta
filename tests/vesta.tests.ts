import { expect} from "chai";
import { MockAgent, setGlobalDispatcher, Interceptable } from 'undici'

import {
  COLUMNS,
  ROWS,
  getVestaFormattedChars,
  getVestaFormattedWords,
  chunkWordsToLines,
  getVestaFormattedLines,
  VESTA_URL,
  Vestaboard
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

  it("should split an array of words into multiple arrays", () => {
    expect(getVestaFormattedWords(['HELLO', 'WORLD']).length).to.equal(2)
  });

  it("should split long messages into multiple lines", () => {
    const words = getVestaFormattedWords(random.split(' '));
    expect(chunkWordsToLines(words).length).to.equal(2)
  });

  it("should not allow messages that are too long", () => {
    expect(getVestaFormattedLines.bind(null, randomLong)).to.throw('String is too long for display')
  });

  describe("with the vestaboard read write api", () => {
    let mockPool: Interceptable;

    before(() => {
      const mockAgent = new MockAgent();
      mockAgent.disableNetConnect();
      mockPool = mockAgent.get(VESTA_URL);
      setGlobalDispatcher(mockAgent);
    });

    it('should send a message to the vestaboard API', async () => {
      const key = 'abcdef';

      mockPool.intercept({
        path: '/',
        method: 'POST',
        headers: {
          'X-Vestaboard-Read-Write-Key': key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([hello_world])
      }).reply(200, {"status": "ok"});


      const vesta = new Vestaboard(key);
      const response = await vesta.sendMessage('hello world');
      expect(response).to.eql({"status": "ok"});
    })
  })
});