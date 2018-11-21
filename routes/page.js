let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');
let Exercise = mongoose.model('exercise');
let Post = mongoose.model('post');
let User = mongoose.model('user');

let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get('/pages/:exercise_id', function (req, res, next) {
    console.log(req.pagess);
    res.json(req.pagess);
});

router.post('/page', function (req, res, next) {
    let page = new Page(req.body);

    page.save(function (err, page) {
        if (err) {
            return next(err);
        }

        let exerciseQuery = Exercise.updateOne({_id: req.body.exercise_id}, {'$push': {pages: page}});
        exerciseQuery.exec(function (err, exercise) {
            if (err) {
                return next(err);
            }
            res.json(page);
        });
    });
});

router.put('/page/:page', function(req, res ,next){

    req.page.title = req.body.title;
    req.page.pathAudio = req.body.pathAudio;
    req.page.description = req.body.description;
    req.page.position = req.body.position;

    req.page.paragraphs = req.body.paragraphs;

    req.page.save(function(err, page){
        if (err) {
            console.log(err);
            return next(err); }

        res.json(page);
    })
});

router.delete('/page/:page', function (req, res, next) {
    req.page.remove(function (err) {
        if (err) return next(err);

        res.json({'message': 'Delete was successful'});

    });

});

router.param('exercise_id', function (req, res, next, id) {
    let query = Exercise.findById(id).populate('pages');

    query.exec(function (err, exercise) {
        if (err) {
            return next(err);
        }
        if (!exercise) {
            return next(new Error('not found ' + id));
        }
        req.pagess = exercise.pages;
        return next();
    });
});

router.param('page', function (req, res, next, id) {
    let query = Page.findById(id);
    query.exec(function (err, page) {
        if (err) {
            return next(err);
        }
        if (!page) {
            return next("Page not found id: " + id);
        }
        req.page = page;
        return next();
    });
});

module.exports = router;