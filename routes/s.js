let router = require('express').Router();

/* GET API page. */
router.get('/', async function(req, res, next) {
	res.send('ok')
});

module.exports = router;
