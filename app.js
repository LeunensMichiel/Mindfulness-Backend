var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
let passport = require('passport');

mongoose.connect('mongodb://localhost/mindfullnessDB');
var con2 = require("./config/fileDB");
require('./models/user');
require('./models/image');

/* 
var mongooseMulti = require('mongoose-multi');
// get all infos from external schema and config file
var config = require('./config/config.js');
var schemaFile = require('./models/schemas.js');

var connections = {};
for (var databaseName in config.db) {
   connections[databaseName] = {
      name: databaseName,
      url: config.db[databaseName],
      schemas: schemaFile[databaseName]
      // options : null - not implemented yet
   };
}

var db = mongooseMulti.start(connections); */



require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*
 * For production we should use https instead of http
 */

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err.message);
});

module.exports = app;
