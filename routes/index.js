let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');

router.get('/API/sessionmap/:sessionmap', function (req, res, next) {
    res.json(req.sessionmap);
});

router.param('sessionmap', function (req, res, next, id) {
    let query = Sessionmap.findById(id);

    query.exec(function (err, sessionmap) {
        if (err) {
            return next(err);
        }

        if (!sessionmap) {
            return next(new Error('not found ' + id));
        }

        let sessionQuery = Session.find({sessionmap_id: id});

        sessionQuery.exec(function(err, sessions) {
            if (err) {
                return next(err);
            }

            if (!sessions) {
                return next(new Error('not found ' + id));
            }

            let result = {
                _id: sessionmap._id,
                titleCourse: sessionmap.titleCourse,
                sessions: sessions
            };


            req.sessionmap = result;

            return next();

        });

    })
});

router.get('/API/exercise/:exercise', function (req, res, next) {
    res.json(req.exercise);
});

router.param('exercise', function (req, res, next, id) {
    let query = Page.find({exercise_id: id});
    query.exec(function (err, exercise) {
        if (err) {
            return next(err);
        }
        if (!exercise) {
            return next(new Error('not found ' + id));
        }
        req.exercise = exercise;
        return next();
    })
});


module.exports = router;