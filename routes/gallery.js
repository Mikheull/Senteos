let router = require('express').Router();
const fs = require("fs");
const moment = require('moment');
moment.locale('fr');

let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

/* GET Gallery page. */
router.get('/', async function(req, res, next) {
	let rawdata = fs.readFileSync('data/generated_playlist.json');
	let generated_playlist = JSON.parse(rawdata);

	if(logged){
		res.render('index', {logged: logged, viewPath: 'gallery/index.ejs', currentPage: 'gallery', baseUri: process.env.BASE_URI,moment: moment, data: {user: user_data, generated_playlist}});
	} else {
		res.redirect('auth');
	}
});
module.exports = router;
