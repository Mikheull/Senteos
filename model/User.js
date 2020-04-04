var SpotifyWebApi = require('spotify-web-api-node');
var spotifyAPI = new SpotifyWebApi();

class User {

    async spotifyLogged(req) {
        if(!req.cookies.spotify_accessToken) return false;
        spotifyAPI.setAccessToken(req.cookies.spotify_accessToken);
        return true
    }

}


module.exports = User;
