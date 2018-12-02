let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
let jwt = require('express-jwt');
let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});
let Feedback = mongoose.model('feedback');


router.post('/feedback', auth, function (req, res, next) {
    let feedback = new Feedback(req.body);
    feedback.save(function (err) {
        if (err) {
            return next(err);
        }
        res.json({result: "geslaagd"});
    });
});

router.get('/feedback', auth, function(req, res, next) {


    let feedbackQuery = Feedback.find(req.query.filter_feedback | "").populate("session");

    feedbackQuery.exec(function(err, listFeedback) {
        if (err) {
            return next(err);
        }

        res.json(listFeedback);
    });
});

module.exports = router;