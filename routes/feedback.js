let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Feedback = mongoose.model('feedback');

let auth = require('../config/auth_config');

router.post('/feedback', auth.auth, function (req, res, next) {
    let feedback = new Feedback(req.body);
    feedback.save(function (err) {
        if (err) {
            return next(err);
        }
        res.json({result: "geslaagd"});
    });
});

router.get('/feedback', auth.auth, auth.authAdmin, function(req, res, next) {


    let feedbackQuery = Feedback.find({},{},{sort: {date: -1}}).populate("session");

    feedbackQuery.exec(function(err, listFeedback) {
        if (err) {
            return next(err);
        }

        res.json(listFeedback);
    });
});

module.exports = router;