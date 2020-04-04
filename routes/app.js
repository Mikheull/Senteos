let router = require('express').Router();
const fs = require("fs");

let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

/* GET Search page. */
router.get('/', function(req, res, next) {
	let rawdata = fs.readFileSync('data/featured_playlist.json');
	let featured_playlist = JSON.parse(rawdata);

	if(logged){
		res.render('index', {logged: logged, viewPath: 'search/index.ejs', currentPage: 'search', baseUri: process.env.BASE_URI, data: {user: user_data, featured_playlist}});
	} else {
		res.redirect('auth');
	}
});

/* POST Search page. */
router.post('/', async function(req, res, next) {
	if(logged){
		let sentence = req.body.query;
		sentence = sentence.trim();
		sentence = sentence.split(' ').join('+');
		res.redirect('/s/'+ sentence)
	}else {
		res.redirect('auth');
	}
});


/* GET Sentence page. */
router.get('/s/:sentence', async function(req, res, next) {

	if(logged){
		let tmp_res, filtered_res, error_status, error_message = false;
		let result = Array();
		let double_result = Array();
		let final_result = Array();
		let sentence = req.params.sentence;
		sentence = sentence.split('+').join(' ');

		if(sentence.length <= 180){

			let decomposed_sentence = sentence.split(" ");

			// Simple
			for(i = 0; i < decomposed_sentence.length; i++){
				tmp_res = await spotify_obj.searchMusic(req, decomposed_sentence[i]);
				if(tmp_res.response.statusText && tmp_res.response.statusText == 'Unauthorized'){
					res.redirect('../auth');
				}else{
					filtered_res = tmp_res.response.tracks.items.filter(d => d.name.toLowerCase() === decomposed_sentence[i].toLowerCase());

					if(filtered_res.length !== 0){
						result[i] = {success: true, response: filtered_res, first_response: filtered_res[0], initial_word: decomposed_sentence[i], start: i + 1, end: i + 1};
					}else{
						result[i] = {success: false, response: "no-result", initial_word: decomposed_sentence[i], start: i + 1, end: i + 1};
					}
					tmp_res, filtered_res = false;
				}
			}

			// Double
			let str = false;
			for(i = 0; i < decomposed_sentence.length; i++){

				str = decomposed_sentence[i]+" "+decomposed_sentence[i + 1];
				tmp_res = await spotify_obj.searchMusic(req, str);
				if(tmp_res.response.statusText && tmp_res.response.statusText == 'Unauthorized'){
					res.redirect('../auth');
				}else{
					filtered_res = tmp_res.response.tracks.items.filter(d => d.name.toLowerCase() === str.toLowerCase());

					if(filtered_res.length !== 0){
						double_result[i] = {success: true, response: filtered_res, first_response: filtered_res[0], initial_word: str, start: i + 1, end: i + 2};
					}else{
						double_result[i] = {success: false, response: "no-result", initial_word: str, start: i + 1, end: i + 1};
					}
					tmp_res, filtered_res = false;
				}
				str = false;
			}

			// Tri
			let skip = false
			for(i = 0; i < decomposed_sentence.length; i++){
				if(!skip){
					if(double_result[i].success == true){
						final_result.push(double_result[i])
						skip = true;
					}else{
						final_result.push(result[i])
						skip = false
					}
				}else{
					skip = false
				}
			}

			// Log la phrase
			await spotify_obj.logSentenceToGallery(final_result, sentence);
		}else{
			error_status = true;
			error_message = `Too long (${sentence.length}/180)`;
		}

		res.render('index', {
			logged: logged, viewPath: 'sentence/index.ejs', currentPage: 'sentence', baseUri: process.env.BASE_URI,
			data: {user: user_data},
			response: {
				error: error_status,
				message: error_message,
				data: {
					final_result, sentence,
				}
			},
		});
	}else {
		res.redirect('../auth');
	}
});

/* POST Sentence page. */
router.post('/s/:sentence', async function(req, res, next) {
	if(logged){
		let music = req.body.music;
		let sentence = req.body.sentence;

		let request = await spotify_obj.createPlaylist(req, sentence, user_data.id);

		if(request.status){
			await spotify_obj.addTracksToPlaylist(req, music.join(','), request.response.id);
			res.redirect('/p/'+ request.response.id)
		}else{
			res.redirect('');
		}
	}else {
		res.redirect('../auth');
	}
});


/* GET Playlist page. */
router.get('/p/:token', async function(req, res, next) {
	let error_status, error_message = false;
	let token = req.params.token;

	if(logged){
		res.render('index', {
			logged: logged, viewPath: 'playlist/index.ejs', currentPage: 'playlist', baseUri: process.env.BASE_URI,
			response: {
				error: error_status,
				message: error_message,
			},
			data: {
				token,
				user: user_data
			}
		});
	}else {
		res.redirect('../auth');
	}
});
module.exports = router;
