const express = require('express');
const router = express.Router();

router.use(async (req, res, next) => {
	logged = req.logged;
	next();
});

router.use('/', require('./app') );
router.use('/auth', require('./auth') );
router.use('/gallery', require('./gallery') );
router.use('/creator', require('./creator') );
router.use('/help', require('./help') );

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
	res.render('404', {baseUri: process.env.BASE_URI});
});
module.exports = router;
