const express = require('express');
const router = express.Router();

router.use('/', require('./index') );
router.use('/api', require('./api') );
router.use('/customize', require('./customize') );
router.use('/s', require('./s') );
router.use('/embed', require('./embed') );

router.use(function(req,res){
    res.status(404).send('404');
});

module.exports = router;
