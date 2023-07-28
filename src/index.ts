import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { logger } from './logger';
import { Vestaboard } from './vesta';
import { LyricalSystems } from './lyrical';
import prefixes from './prefix.json'

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const { VESTA_API_KEY = '', VESTA_CHANGE_DURATION_IN_MINUTES = 10 } = process.env;
logger.info(`Vesta change duration is set to: ${VESTA_CHANGE_DURATION_IN_MINUTES}`)

cron.schedule(`*/${VESTA_CHANGE_DURATION_IN_MINUTES} * * * *`, () => {
  const vesta = new Vestaboard(VESTA_API_KEY);
  const rand = Math.floor(Math.random() * prefixes.length);
  LyricalSystems.getCurrentSongForRandomPlayer()
    .then(async (player) => {
      if (player) {
        vesta.sendMessage(`${prefixes[rand]} Room ${player.room}: ${player.song.title} by ${player.song.artist}!`)
          .then((res) => logger.info(res))
          .catch((err) => logger.error(err));
      }
    });
})
