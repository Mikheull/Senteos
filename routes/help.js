let router = require('express').Router();
let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	user_data = req.user_data;
	next();
});

/* GET Search page. */
router.get('/', async function(req, res, next) {
	if(logged){
		res.render('index', {logged: logged, viewPath: 'help/index.ejs', currentPage: 'help', baseUri: process.env.BASE_URI, data: {user: user_data}});
	} else {
		res.redirect('auth');
	}
});
module.exports = router;
