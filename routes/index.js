var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Tic-Tac-Toe',
        description: 'Tic-Tac-Toe built from JavaScript, CSS, and HTML. A Free Code Camp project.'
    });
});

module.exports = router;
