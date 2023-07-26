const ORG = '85d117ad5cc3480cbf801cb0b822f69f';
const VESTA = 'MzAyZGJmYmYtMTE4Ny00ODRhLWI4OTAtMDM0YmE0MzU1MDFm';
const COLUMNS = 22;
const ROWS = 6;


const vestaChars = ` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$()\\-\\+&=;:\\'"%,.\\\\/?`;
const charArray = vestaChars.split('').map((char, idx) => {
  if(char !== '\\') return [char, idx]
}).filter(c => c);
const CHARMAP = new Map(charArray);

export function enableAPI() {
  fetch('http://192.168.1.215:7000/local-api/enablement', {
    method: 'POST',
    headers: {
      'X-Vestaboard-Local-Api-Enablement-Token': 'Njk5ZmE5MDEtYWM4Yy00M2ZlLWI2NDAtMTZiYmNhYzhlZmQz'
    }
  }).then(res => res.json())
    .then(data => tonsole.log(data))
}

export function getPlayerControlCodes() {
  return fetch('http://vbserver:8001/players')
    .then(res => res.text())
    .then(data => {
      // this is very unsafe, but the output isn't valid
      const all = eval(data);
      const players = all.map(player => { return { id: player.id, control_code: player.control_code } });
      console.log(players);
      const match = data.match(/^\s*control_code:\s*'.{4}',$/gm);
      const codes = match.map(line => line.trim().slice(-6,-2));
      return codes;
    })
}

export function getPlayerDetails() {
  return fetch('http://vbserver:8001/players')
    .then(res => res.text())
    .then(data => {
      // this is very unsafe, but the output isn't valid
      const players = eval(data);
      return players.map(player => { return { id: player.player_id, control_code: player.control_code } });
    })
}

export function getCurrentSongForPlayer(player) {
  return fetch(`https://singatpitch.com/api/v1/queue.json?organization=${ORG}&room_code=${player.control_code}`)
    .then(res => res.json())
    .then(data => {
      if(data.current_song) {
        return { id: player.id, song: data.current_song }
      } else {
        return null;
      }
    });
}

export function getCurrentSongForRandomPlayer() {
  return getPlayerDetails()
    .then(players => {
      console.log(players);
      const player = players[Math.floor(Math.random()*players.length)];
      return getCurrentSongForPlayer(player);
    });
  /*
  return getPlayerControlCodes()
    .then(codes => {
      const code = codes[Math.floor(Math.random()*codes.length)];
      return getCurrentSongForPlayer(code);
    });
  */
}

export function getCurrentSongForActiveRandomPlayer(timeout = 10) {
  if (timeout <= 0) return;

  return getCurrentSongForRandomPlayer()
    .then(player => {
      return (player)
        ? player
        : getCurrentSongForActiveRandomPlayer(timeout--)
    });
}

export function getVestaFormattedMessage(message) {
  const words = message.split(' ');

  const lines = words.reduce((acc, word, idx, arr) => {
    const chars = word.split('').map(char => {
      if(CHARMAP.has(char.toUpperCase())) {
        return CHARMAP.get(char.toUpperCase());
      } else {
        return 0;
      }
    }).concat([0]);

    const row = acc.length;

    if(acc[row-1].length + chars.length > COLUMNS) {
      const remainder = COLUMNS - acc[row - 1].length;
      acc[row - 1] = acc[row - 1].concat(Array(remainder).fill(0))
      acc[row] = chars;
    } else {
      acc[row-1] = acc[row-1].concat(chars)
    }
    return acc;
  }, [[]]);


  if(lines[lines.length - 1].length < COLUMNS) {
    const remainder2 = COLUMNS - lines[lines.length - 1].length;
    lines[lines.length - 1] = lines[lines.length - 1].concat(Array(remainder2).fill(0))
  }

  if (lines.length < ROWS) {
    const remainder = ROWS - lines.length;
    for(let i = 0; i<remainder; i++) {
      lines.push(Array(22).fill(0));
    }
  }

  return lines;
}

export function sendMessageToVestaBoard() {

  getCurrentSongForActiveRandomPlayer()
    .then(player => {
      const message = `Room ${player.id} is rocking out to ${player.song.title} by ${player.song.artist}`;
      fetch('http://192.168.1.215:7000/local-api/message', {
        method: 'POST',
        headers: {
          'X-Vestaboard-Local-Api-Key': VESTA,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getVestaFormattedMessage(message))
      }).then(res => {
        if(res.ok) {
          console.log(res.text());
        } else {
          console.log(res);
        }
      }).catch((e) => {
        console.log(e);
      });
    })
}

// enableAPI();
// getPlayerControlCodes();
// getCurrentSongForRandomPlayer();
//getCurrentSongForActiveRandomPlayer()
sendMessageToVestaBoard();
