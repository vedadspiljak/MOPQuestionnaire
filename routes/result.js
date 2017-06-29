/**
 * Created by vedad on 28.6.2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('result',{title:'MOP Questionnaire ',message:'Podaci su spremljeni'});
});
module.exports = router;
