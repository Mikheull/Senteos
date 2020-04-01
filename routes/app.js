let router = require('express').Router();
let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	next();
});

/* GET Search page. */
router.get('/', async function(req, res, next) {
	if(logged){
		res.render('index', {logged: logged, viewPath: 'search/index.ejs', currentPage: 'search', baseUri: process.env.BASE_URI});
	} else {
		res.redirect('auth');
	}
});

/* POST Search page. */
router.post('/', async function(req, res, next) {
	let tmp_res, filtered_res, error_status, error_message = false;
	let result = Array();
	let sentence = req.body.query;

	if(sentence.length <= 180){

		let decomposed_sentence = sentence.split(" ");
		for(i = 0; i < decomposed_sentence.length; i++){
			tmp_res = await spotify_obj.searchMusic(req, decomposed_sentence[i]);
			filtered_res = tmp_res.response.tracks.items.filter(d => d.name === decomposed_sentence[i]);

			if(filtered_res.length > 1){
				result[i] = filtered_res
			}else{
				result[i] = {response_error: "no-result", initial_word: decomposed_sentence[i]};
			}
		}
		tmp_res, filtered_res = false;

	}else{
		error_status = true;
		error_message = `Too long (${sentence.length}/180)`;
	}


	res.render('index', {
		logged: logged, viewPath: 'search/index.ejs', currentPage: 'search', baseUri: process.env.BASE_URI,
		response: {
			error: error_status,
			message: error_message,
			data: {
				result, sentence
			}
		},
	});
});


module.exports = router;
