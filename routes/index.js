let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');
let Exercises = mongoose.model('exercise');

router.get('/API/sessionmaps', function (req, res, next) {
    let query = Sessionmap.find().populate("sessions");
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }

        sessionmaps.forEach(function (element) {
            console.log(element);
        });

        res.json(sessionmaps);
    });


});

router.post('/API/sessies', function (req, res, next) {
    let sessie = new Sessie({
        title: req.body.title
    });
    sessie.save(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });

});
router.get('/API/sessionmap/:sessionmap', function (req, res, next) {
    res.json(req.sessionmap);
});

router.param('sessionmap', function (req, res, next, id) {
    let query = Sessionmap.findById(id).populate("sessions");

    query.exec(function (err, sessionmap) {
        if (err) {
            return next(err);
        }

        if (!sessionmap) {
            return next(new Error('not found ' + id));
        }

        req.sessionmap = sessionmap;

        return next();

    })
});


router.get('/API/exercises/:exercise', function (req, res, next) {
    res.json(req.exercise);
});

router.param('exercise', function (req, res, next, id) {
    let query = Exercises.find({session_id: id});
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

router.get('/API/pages/:page', function (req, res, next) {
    res.json(req.pagess);
});

router.param('page', function (req, res, next, id) {
    let query = Page.find({exercise_id: id});

    query.exec(function (err, pages) {
        if (err) {
            return next(err);
        }
        if (!pages) {
            return next(new Error('not found ' + id));
        }
        req.pagess = pages;
        return next();
    });
});


module.exports = router;