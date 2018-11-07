"use strict";

const logger = require('morgan'),
    busboyBodyParser = require('busboy-body-parser'),
    passport = require('passport');




module.exports = (app) => {
    app.use(logger('dev'));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use(busboyBodyParser({limit: '10mb'}));
    app.use(logger('dev'));
    app.use(passport.initialize());

    require('../config/fileDB');
    require('../models/image');
    require('../models/user');
    require('../models/page');
    require('../models/feedback');
    require('../models/sessionmap');
    require('../models/group');
    require('../models/exercise');
    require('../models/session');
    require('../models/paragraph');
    require('../models/post');

    require('../config/passport');

    //[*]Routes Configuration
    let indexRouter = require('../routes/index');
    let usersRouter = require('../routes/users');
    let fileRouter = require('../routes/files');

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/files', fileRouter);
};
