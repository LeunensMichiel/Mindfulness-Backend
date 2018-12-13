let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let auth = require('../config/auth_config');

let Session = mongoose.model('session');
let Exercise = mongoose.model('exercise');

router.get('/exercises/:session', auth.auth, function (req, res, next) {
    res.json(req.exercises);
});

router.get('/pages_of_exercise/:exercise', auth.auth, function (req, res, next) {
    res.json(req.exercise.pages);
});

router.param('session', function (req, res, next, id) {
    let query = Session.findById(id).populate("exercises");
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

router.get('/exercise/:exercise', auth.auth, function (req, res, next) {
    res.json(req.exercise);
});

router.post('/exercise', auth.auth, auth.authAdmin, function (req, res, next) {
    let ex = new Exercise(req.body);
    ex.save(function (err, exercise) {
        if (err) {
            return next(err);
        }

        let exerciseQuery = Session.updateOne({_id: req.body.session_id}, {'$push': {exercises: exercise}});
        exerciseQuery.exec(function (err, session) {
            if (err) {
                return next(err);
            }

            res.json(exercise);

        });
    });
});

router.delete('/exercise/:exercise', auth.auth, auth.authAdmin, function (req, res) {
    Exercise.remove({_id: {$in: req.exercise.pages}}, function (err) {
        if (err) return next(err);
        req.exercise.remove(function (err) {
            if (err) {
                return next(err)
            }
            res.json(req.exercise);
        });
    });
});

router.put('/exercise/:exercise', auth.auth, auth.authAdmin, function (req, res, next) {
    let exercise = req.exercise;
    exercise.title = req.body.title;
    exercise.position = req.body.position;
    exercise.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});


router.param('exercise', function (req, res, next, id) {
    let query = Exercise.findById(id).populate("pages");

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