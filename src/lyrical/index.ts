import { logger } from '../logger';

export const VBSERVER = 'http://vbserver:8001';

export type Song = {
  code: number
  guid: string,
  title: string,
  artist: string,
  url: string,
  streaming: boolean,
  duration: number,
  position: number,
  paused: boolean,
  pitch_shift: number,
  audio_channels: string,
  session: string,
  message: string,
  message_color: string,
  test: boolean
};

export type Player = {
  player_id: number,
  player_guid: string,
  player_type: string,
  player_version: string,
  player_os: string,
  player_hw: string,
  control_code: string,
  connected: boolean,
  active: boolean,
  phase: string,
  has_config: boolean,
  ip_address: string,
  test_mode: boolean,
  reset_state: string | null,
  last_reset: {
    command: string,
    reason: string,
    notes: string | null,
    start_time: string,
    disconnect_duration: number,
    duration: number,
    error: string | null,
  },
  last_connected_at: string,
  computer_started_at: string,
  display_control_code: boolean,
  showing_interstitial: boolean,
  has_service_interstitial: boolean,
  show_service_interstitial: boolean,
  service_call: string | null,
  photos_queued: number,
  zoom_state: string | null,
  zoom_meeting_id?: string,
  zoom_date : string | null,
  songs_queued: number,
  queue_limit: number,
  volume: number,
  lighting_mode: number,
  lighting_effects: boolean,
  current_song: Song | null
}

export type RandomPlayer = {
  room: number,
  song: Song
}

export class LyricalSystems {
  url: string;

  org: string;

  version: string;

  static async getLocalPlayers(): Promise<Player[]> {
    const response = await fetch(`${VBSERVER}/players.json`);
    return response.json();
  }

  static async getCurrentSongForPlayer(code: string): Promise<Song | null> {
    const players = await LyricalSystems.getLocalPlayers();
    const player = players.find(({ control_code: c }) => c === code);

    if (!player) throw new Error(`Could not find player with control code ${code}`);
    return player.current_song;
  }

  static async getCurrentSongForRandomPlayer(): Promise<RandomPlayer | null> {
    const players = await LyricalSystems.getLocalPlayers();
    logger.debug(`${this.name} - current players: ${JSON.stringify(players)}`);

    const active = players.filter((p) => p.current_song !== null);
    logger.debug(`${this.name} - active players: ${JSON.stringify(active)}`);

    if (active.length) {
      const player = active[Math.floor(Math.random() * active.length)];
      logger.debug(`${this.name} - random player: ${JSON.stringify(player)}`);
      return { room: player.player_id, song: player.current_song as Song };
    }

    return null;
  }

  constructor(url: string, org: string, version: string = 'v1') {
    this.url = url;
    this.org = org;
    this.version = version;
  }
}
