var express = require('express');
var router = express.Router();
var myApp = require('../app');
var pg = require('pg');
/* GET users listing. */
router.get('/:id', function(req, res, next) {

    var connect = myApp.connect;
    var client = new pg.Client(connect);
    // connect to our database
    var odgovori;
    client.connect();

    client.query('SELECT * FROM predefinisani_odgovori WHERE(Select id FROM pitanja Where upitnik_id=$1 AND id=pitanje_id) = pitanje_id order by random() limit 1000;',[req.params.id], function (err, result) {
        if (err) throw err;
        if(result!=null)
            odgovori = result.rows;
    });

    client.query('SELECT * FROM pitanja WHERE upitnik_id=$1',[req.params.id], function (err, result) {
        if (err) throw err;
        var all = result.rows;

        res.render('start',{pitanja: all,title:'MOP Questionnaire',odgovori:odgovori})

        // execute a query on our database

        client.end(function (err) {
            if (err) throw err;
        });
    });

});



module.exports = router;
