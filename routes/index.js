var express = require('express');
var router = express.Router();
var myApp = require('../app');
var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {

    var connect = myApp.connect;
    var client = new pg.Client(connect);
    // connect to our database

    client.connect();
    client.query('SELECT * FROM upitnik', function (err, result) {
        if (err) throw err;
        res.render('index',{upitniks: result.rows,title:'MOP Questionnaire'})

        // execute a query on our database
        client.end(function (err) {
            if (err) throw err;
        });
    });
});


module.exports = router;