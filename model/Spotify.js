const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyAPI = new SpotifyWebApi();


class Spotify {

    async getUserData(req) {
		const token = req.cookies.spotify_accessToken;
        return axios({
            method: 'get',
            url: "https://api.spotify.com/v1/me",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			return {status: false};
        });
    }

    async searchMusic(req, query) {
		const token = req.cookies.spotify_accessToken;
		return axios({
            method: 'get',
            url: "https://api.spotify.com/v1/search?q=\""+query+"\"&type=track",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            return {status: true, response: response.data};
        })
        .catch(err => {
			console.log(err);

			return {status: false};
        });
	}

}

module.exports = Spotify;
