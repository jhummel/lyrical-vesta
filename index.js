import fetch from 'node-fetch';
const ORG = '85d117ad5cc3480cbf801cb0b822f69f';
const VESTA = 'OTgwZWFlNWEtMDAwYi00ZDQ4LWI5YTgtZGZkMjJlZmYyN2Iw';
const COLUMNS = 22;
const ROWS = 6;
export function enableAPI() {
  fetch('http://192.168.1.215:7000/local-api/enablement', {
    method: 'POST',
    headers: {
      'X-Vestaboard-Local-Api-Enablement-Token': 'Njk5ZmE5MDEtYWM4Yy00M2ZlLWI2NDAtMTZiYmNhYzhlZmQz'
    }
  }).then(res => res.json())
    .then(data => console.log(data))
}

export function getPlayerControlCodes() {
  return fetch('http://vbserver:8001/players')
    .then(res => res.text())
    .then(data => {
      const match = data.match(/^\s*control_code:\s*'.{4}',$/gm);
      return match.map(line => line.trim().slice(-6,-2));
    })
}

export function getCurrentSongForPlayer(code) {
  return fetch(`https://singatpitch.com/api/v1/queue.json?organization=${ORG}&room_code=${code}`)
    .then(res => res.json())
    .then(data => data.current_song);
}

export function getCurrentSongForRandomPlayer() {
  return getPlayerControlCodes()
    .then(codes => {
      const code = codes[Math.floor(Math.random()*codes.length)];
      return getCurrentSongForPlayer(code);
    });
}

export function getCurrentSongForActiveRandomPlayer(timeout = 10) {
  if (timeout <= 0) return;

  return getCurrentSongForRandomPlayer()
    .then(song => {
      return (song)
        ? song
        : getCurrentSongForActiveRandomPlayer(timeout--)
    });
}

export function getVestaFormattedMessage(message) {
  const words = message.split(' ');
  const lines = [];

  return words.reduce((acc, word) => {
    const line = acc.length;
    let current = line ? acc[line-1] : [];
    if (current.length + word.length + 1 < COLUMNS) {
      current = current.concat((word + ' ').split(''))
      console.log(current);
      acc[line - 1] = current;
    } else {
      if (line < ROWS) {
        acc[line] = (word + ' ').split()
      }
    }

    return acc;
  }, []);
}

export function sendMessageToVestaBoard() {

  getCurrentSongForActiveRandomPlayer()
    .then(song => {
      const message = song.title + ' by ' + song.artist;
      console.log(getVestaFormattedMessage(message));
    });
  /*
  fetch('http://192.168.1.215:7000/local-api/message', {
    method: 'POST',
    headers: {
      'X-Vestaboard-Local-Api-Key': VESTA
    },
    body: getVestaFormattedMessage(message);
  */
}

// enableAPI();
// getPlayerControlCodes();
// getCurrentSongForRandomPlayer();
//getCurrentSongForActiveRandomPlayer()
sendMessageToVestaBoard();
