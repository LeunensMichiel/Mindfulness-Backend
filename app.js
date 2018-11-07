var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
let passport = require('passport');

var fs = require('fs')

mongoose.connect('mongodb://projecten3studserver03.westeurope.cloudapp.azure.com/mindfulnessdb', { useNewUrlParser: true });
require('./config/fileDB');
require('./models/image');
require('./models/user');
require('./models/page');
require('./models/feedback');
require('./models/sessionmap');
require('./models/group');
require('./models/exercise');
require('./models/session');
require('./models/paragraph');
require('./models/post');

require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileRouter = require('./routes/files');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/file', fileRouter);

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

app.post('/upload',function(req,res){
    console.log(req.files.image.__dirname);
    console.log(req.files.image.dirname);
    console.log(req.files.image.path);
    fs.readFile(req.files.image.path, function(err,data){
        var dirname = "../../file-upload";
        var newPath = dirname + "/uploads/" + req.files.image.dirname;
        fs.writeFile(newPath,data,function(err){
            if(err){
                res.json({'response':"Error"});
            }
            else{
                res.json({'response':"Saved"});
            }
        });
    });
});

app.get('/uploads/:file',function(req,res){
    file = req.params.file;
    var dirname = "../../file-upload";
    var img = fs.readFileSync(dirname + "/uploads/" + file);
    res.writeHead(200,{'Content-Type':'image/jpg'});
    res.end(img,'binary');
});

module.exports = app;
