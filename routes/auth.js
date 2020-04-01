let router = require('express').Router();
const SpotifyAPI = require('spotify-web-api-node');
const request = require('request');
const querystring = require('querystring');


let logged;
router.use(async (req, res, next) => {
	logged = req.logged;
	next();
});


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_CALLBACK;
const scope = 'playlist-modify-public';
const stateKey = 'spotify_auth_state';

let generateRandomString = function(length) {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};



/* GET home page. */
router.get('/', async function(req, res, next) {
	res.render('auth', { logged: logged, baseUri: process.env.BASE_URI });
});


router.get('/spotify', function(req, res, next) {
	let state = generateRandomString(16);
	res.cookie(stateKey, state);

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
		response_type: 'code',
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
		state: state
    }));
});


router.get('/spotify/callback', function(req, res) {

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' + querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
                headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {

            if (!error && response.statusCode === 200) {

				let access_token = body.access_token,
					refresh_token = body.refresh_token;

				let options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};

				// use the access token to access the Spotify Web API
				request.get(options, function(error, response, body) {
					// console.log(body);
				});

				// we can also pass the token to the browser to make requests from there
				res.cookie('spotify_accessToken', access_token, {maxAge: Date.now() + (10 * 365 * 24 * 60 * 60)});
				res.redirect('/');

            } else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
				}));
			}
        });
    }
});



router.get('/spotify/token', function(req, res) {

    // requesting access token from refresh token
    let token = req.query.token;

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            re
        }else{
            res.send({
                'access_token': null
            });
        }
    });
});


module.exports = router;
