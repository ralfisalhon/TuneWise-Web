export const playSong = (token, uri, errorFn = () => {}, successFn = () => {}) => {
  if (!token || !uri) return errorFn('no token or uri');

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
    .then((content) => {
      const status = content.status;
      if (status === 403 || status === 404) {
        errorFn('could not authenticate. please login with spotify again.');
      }
      if (status === 401 || status === 404) {
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
