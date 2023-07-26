import { expect } from "chai";
import { VBSERVER, LyricalSystems } from '../src/lyrical';
import { MockAgent, setGlobalDispatcher, Interceptable } from 'undici'

const codes = ['AAAA', 'BBBB', 'CCCC']

type SongMock = {
  artist: string,
  title: string
}

type PlayerMock = {
  control_code: string,
  current_song: SongMock | null
}

const current_song = {
  artist: 'Me',
  title: 'My Song'
};

const players: PlayerMock[] = codes.map(code => ({
  player_id: 1,
  control_code: code,
  current_song
}));

const emptyPlayers = codes.map(code => ({
  player_id: 1,
  control_code: code,
  current_song: null
}));

describe('Lyrical tests', () => {

  describe('from the lyrical conn', () => {
    let mockPool: Interceptable;

    function createIntercept(response = players) {
      mockPool.intercept({ path: '/players.json' }).reply(200, response);
    }

    before(() => {
      const mockAgent = new MockAgent();
      mockAgent.disableNetConnect();
      mockPool = mockAgent.get(VBSERVER);
      setGlobalDispatcher(mockAgent);
    })


    it('can get the current song for a player', async () => {
      createIntercept();

      const song = await LyricalSystems.getCurrentSongForPlayer(codes[0]);
      expect(song).to.eql(current_song);
    })

    it('will throw an error if trying to find the song of a nonexistant player', async () => {
      createIntercept();
      expect(LyricalSystems.getCurrentSongForPlayer.call(LyricalSystems, 'ZZZZ')).to.throw;
    })

    it('can get the current song for a random player', async () => {
      createIntercept();

      const player = await LyricalSystems.getCurrentSongForRandomPlayer();
      expect(player).to.eql({ room: 1, song: current_song });
    })

    it('should return null if no players are currently active', async () => {
      createIntercept(emptyPlayers);

      const song = await LyricalSystems.getCurrentSongForRandomPlayer();
      expect(song).to.eql(null);
    })

    it('can create an instance', () => {
      const url = 'https://example.org';
      const org = 'abcdef'
      const lyrical = new LyricalSystems(url, org)

      expect(lyrical.url).to.eql(url);
      expect(lyrical.org).to.eql(org);
      expect(lyrical.version).to.eql('v1')
    })
  })
})