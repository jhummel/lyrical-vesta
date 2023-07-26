import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { Vestaboard } from './vesta';
import { LyricalSystems } from './lyrical';
import prefixes from './prefix.json'

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

cron.schedule('*/2 * * * *', () => {
  const { VESTA_API_KEY = '' } = process.env;
  const vesta = new Vestaboard(VESTA_API_KEY);
  const rand = Math.floor(Math.random() * prefixes.length);
  LyricalSystems.getCurrentSongForRandomPlayer()
    .then(async (player) => {
      if (player) {
        vesta.sendMessage(`${prefixes[rand]} Room ${player.room}: ${player.song.title} by ${player.song.artist}!`)
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
      }
    });
})
