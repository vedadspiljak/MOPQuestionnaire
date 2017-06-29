var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var start = require('./routes/start');
var result = require('./routes/result');

var app = express();

//connection string
var connect = "postgres://rhxumcgxupajom:3ccabf359b827220cdbee51c0d34789e24dce5ee2430dea66cc0fd63a578f773@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/d62rt6hf5pf1ca"
module.exports.connect = connect;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/start', start);
app.use('/result', result);


app.post('/save', function(req, res) {
    var pg = require('pg');
    var client = new pg.Client(connect);
    // connect to our database
    var user_id;
    client.connect();
    if(req.body.ime!="" && req.body.prezime!="" && req.body.email!="") {
    client.query('INSERT INTO korisnik(ime, prezime,email) values ($1, $2, $3) RETURNING id AS user_id',[req.body.ime,req.body.prezime,req.body.email], function (err, result) {
        if (err) throw err;
        if(result!=null)
            user_id = result.rows[0].user_id;

        if(user_id!=undefined) {
            for (var x in req.body.pitanje_id) {
                var tekst = req.body[req.body.pitanje_id[x]];
                var pitanje_id = req.body.pitanje_id[x];
                var upitnik_id = req.body.upitnik_id[x];
                var date = new Date();

                if(tekst!="" && pitanje_id!="" && upitnik_id!="") {
                    client.query('INSERT INTO odgovori_korisnik(korisnik_id,upitnik_id,pitanje_id,datum_zavrsetka,odgovor) VALUES ($1,$2,$3,$4,$5)', [user_id, upitnik_id, pitanje_id, date, tekst], function (err, result) {
                        if (err)
                            throw err;
                    });
                }
            }
        }
        res.redirect('/result');
    });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
