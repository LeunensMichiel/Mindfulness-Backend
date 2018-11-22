let express = require('express');
let router = express.Router();
const multer = require('multer');
const fs = require('fs');

let mongoose = require("mongoose");

let Page = mongoose.model('page');
let Exercise = mongoose.model('exercise');


let jwt = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/page_audio');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// through this variable we filter what files we accept and what not
// const fileFilter = (req, file, cb) => {
//
// }

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get('/pages/:exercise_id', function (req, res, next) {
    console.log(req.pagess);
    res.json(req.pagess);
});

router.post('/page', auth, function (req, res, next) {
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

router.put('/page/:page', auth,function(req, res ,next){

    req.page.title = req.body.title;
    req.page.path_audio = req.body.path_audio;
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

router.put('/pagefile/:page', auth, upload.single("page_file"), function(req, res, next) {

    req.page.path_audio = req.file.path;

    req.page.save(function(err, page){
        if (err) {
            console.log(err);
            return next(err); }

        res.json(page);
    });
});

router.delete('/page/:page', auth, function (req, res, next) {
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