let router = require('express').Router();
let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;

	req.io.sockets.on('connection', function (socket) {
		console.log(`Socket ${socket.id} connected.`);

		socket.on('disconnect', () => {
			console.log(`Socket ${socket.id} disconnected.`);
		});

		socket.on('send_query', async function(query, sock_id) {
			let tmp_res, filtered_res, error_status, error_message = false;
			let result = Array();
			let double_result = Array();
			let response = Array();
			let sentence = query;

			if(logged){

				if(sentence.length <= 180){

					let decomposed_sentence = sentence.split(" ");

					// Simple
					for(i = 0; i < decomposed_sentence.length; i++){
						tmp_res = await spotify_obj.searchMusic(req, decomposed_sentence[i]);
						if(tmp_res.response.statusText && tmp_res.response.statusText == 'Unauthorized'){
							error_status = true;
							error_message = `You are not connected to Spotify`;
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
							error_status = true;
							error_message = `You are not connected to Spotify`;
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
							if(double_result[i] && double_result[i].success == true){
								response.push(double_result[i])
								skip = true;
							}else{
								response.push(result[i])
								skip = false
							}
						}else{
							skip = false
						}
					}

				}else{
					error_status = true;
					error_message = `Too long (${sentence.length}/180)`;
				}

			}else {
				error_status = true;
				error_message = `You are not connected to Spotify`;
			}

			req.io.sockets.sockets[sock_id].emit('response_query', error_status, error_message, sentence, response);
		});
	});

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



module.exports = router;
