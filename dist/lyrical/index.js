"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricalSystems = exports.VBSERVER = void 0;
exports.VBSERVER = 'http://vbserver:8001';
class LyricalSystems {
    url;
    org;
    version;
    static async getLocalPlayers() {
        const response = await fetch(`${exports.VBSERVER}/players.json`);
        return response.json();
    }
    static async getCurrentSongForPlayer(code) {
        const players = await LyricalSystems.getLocalPlayers();
        const player = players.find(({ control_code: c }) => c === code);
        if (!player)
            throw new Error(`Could not find player with control code ${code}`);
        return player.current_song;
    }
    static async getCurrentSongForRandomPlayer() {
        const players = await LyricalSystems.getLocalPlayers();
        const active = players.filter((p) => p.current_song !== null);
        if (active.length) {
            const player = active[Math.floor(Math.random() * active.length)];
            return { room: player.player_id, song: player.current_song };
        }
        return null;
    }
    constructor(url, org, version = 'v1') {
        this.url = url;
        this.org = org;
        this.version = version;
    }
}
exports.LyricalSystems = LyricalSystems;
//# sourceMappingURL=index.js.map