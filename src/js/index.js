export const playSong = (token, uri, errorFn = () => {}, successFn = () => {}) => {
  console.log('my token is', token, 'uri is', uri);
  const baseURI = 'https://api.spotify.com/v1';
  const url = baseURI + '/me/player/play';

  fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  })
    // .then((response) => response.text())
    .then((content) => {
      const status = content.status;
      console.log('/playSong status:', status);
      if (status === 401) {
        errorFn('could not play song. try playing and pausing a song on your spotify.');
      } else if (status === 204) {
        successFn();
      }
    })
    .catch((error) => {
      console.log('error on /playSong:', error);
      errorFn('something went wrong. check console.');
    });
};
