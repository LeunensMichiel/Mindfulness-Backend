let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');

let mongoose = require('mongoose');
let passport = require('passport');

let fs = require('fs');

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

// let indexRouter = require('./routes/index');
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

let app = express();

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


module.exports = app;
