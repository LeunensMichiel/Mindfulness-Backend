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




// paragraph
router.get('/API/paragraphs/:paragraph', function (req, res, next) {
    res.json(req.paragraphs);
});

router.param('paragraph', function (req, res, next, id) {
    let query = Paragraph.find({ page_id: id });

    query.exec(function (err, paragraph) {
        if (err) {
            return next(err);
        }
        if (!paragraph) {
            return next(new Error('not found ' + id));
        }
        req.paragraph = paragraph;
        return next();
    });
});

module.exports = router;