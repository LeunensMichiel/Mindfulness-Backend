let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');
let Exercise = mongoose.model('exercise');
let Post = mongoose.model('post');
let Paragraph = mongoose.model('paragraph');
let User = mongoose.model('user');

let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get('/API/exercises/:session_id', function (req, res, next) {
    res.json(req.exercises);
});

router.param('session_id', function (req, res, next, id) {
    let query = Session.findById(id).populate({
        path: 'exercises',
        populate: {
            path: 'pages',
            model: 'page'
        }
    });
    query.exec(function (err, session) {
        if (err) {
            return next(err);
        }
        if (!session) {
            return next(new Error('not found ' + id));
        }
        req.exercises = session.exercises;
        return next();
    })
});

router.get('/API/exercise/:exercise', function (req, res, next) {
    res.json(req.exercise);
});

router.delete('/API/exercises/:exercise', function (req, res) {
    Exercise.remove({ _id: { $in: req.exercise.pages } }, function (err) {
        if (err) return next(err);
        req.exercise.remove(function (err) {
            if (err) {
                return next(err)
            }
            res.json(req.exercise);
        });
    });
});

router.put('/API/exercise/:exercise', function (req, res, next) {
    let exercise = req.exercise;
    exercise.title = req.body.title;
    exercise.position = req.body.position;
    exercise.session_id = req.body.session_id;
    exercise.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});

router.param('exercise', function (req, res, next, id) {
    let query = Exercise.findById(id);

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