const express = require('express');
const router = express.Router();
let logged;
let spotify_obj = new (require('../model/Spotify'))()

router.use(async (req, res, next) => {
	logged = req.logged;
	next();
});

router.use('/app', require('./app') );
router.use('/auth', require('./auth') );

/* GET spotify logout */
router.get('/logout', function (req, res) {
    for (let prop in req.cookies) {
        if (!req.cookies.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
    }

	res.redirect('/');
})

router.use(function(req,res){
	if(logged){
    	res.render('soon.ejs');
	} else {
		res.redirect('auth');
	}
});

module.exports = router;
