var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
let passport = require('passport');

var fs = require('fs');

mongoose.connect('mongodb://projecten3studserver03.westeurope.cloudapp.azure.com/mindfulnessdb', { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);

require('./models/user');
require('./models/page');
require('./models/feedback');
require('./models/sessionmap');
require('./models/group');
require('./models/exercise');
require('./models/session');
require('./models/post');


require('./config/passport');

// var indexRouter = require('./routes/index');
let userRouter = require('./routes/user');
let fileRouter = require('./routes/files');
let exerciseRouter = require('./routes/exercise');
let sessionRouter = require('./routes/session');
let sessionmapRouter = require('./routes/sessionmap');
let pageRouter = require('./routes/page');
let postRouter = require('./routes/post');
let groupRouter = require('./routes/group');
let feedbackRouter = require('./routes/feedback');
let adminRouter = require('./routes/admin');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// app.use('/', indexRouter);
app.use('/API/exercise', exerciseRouter);
app.use('/API/session', sessionRouter);
app.use('/API/sessionmap', sessionmapRouter);
app.use('/API/page', pageRouter);
app.use('/API/post', postRouter);
app.use('/API/group', groupRouter);
app.use('/API/users', userRouter);
app.use('/API/file', fileRouter);
app.use('/API/feedback', feedbackRouter);
app.use('/API/superadmin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

/*
 * For production we should use https instead of http
 */

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.json(err.message);
// });

// app.post('/upload',function(req,res){
//     console.log(req.files.image.__dirname);
//     console.log(req.files.image.dirname);
//     console.log(req.files.image.path);
//     fs.readFile(req.files.image.path, function(err,data){
//         var dirname = "../../file-upload";
//         var newPath = dirname + "/uploads/" + req.files.image.dirname;
//         fs.writeFile(newPath,data,function(err){
//             if(err){
//                 res.json({'response':"Error"});
//             }
//             else{
//                 res.json({'response':"Saved"});
//             }
//         });
//     });
// });

app.get('/uploads/:file',function(req,res){
    file = req.params.file;
    var dirname = "../../file-upload";
    var img = fs.readFileSync(dirname + "/uploads/" + file);
    res.writeHead(200,{'Content-Type':'image/jpg'});
    res.end(img,'binary');
});

module.exports = app;
