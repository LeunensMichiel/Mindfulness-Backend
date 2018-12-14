let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');

let auth = require('../config/auth_config');

router.get('/sessionmap/:sessionmap', auth.auth, function (req, res, next) {
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

router.get('/sessionmaps', auth.auth, function (req, res, next) {
    let query = Sessionmap.find().populate("sessions");
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }
        res.json(sessionmaps);
    });
});

router.post('/sessionmap', auth.auth, auth.authAdmin, function (req, res, next) {
    let sessionmap = new Sessionmap({
        titleCourse: req.body.titleCourse
    });
    sessionmap.save(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });

});

router.delete('/sessionmap/:sessionmap', auth.auth, auth.authAdmin, function (req, res) {
    Sessionmap.remove({_id: {$in: req.sessionmap.sessions}}, function (err) {
        if (err) return next(err);
        req.sessionmap.remove(function (err) {
            if (err) {
                return next(err);
            }
            res.json(req.sessionmap);
        });
    });
});

router.put('/sessionmap/:sessionmap/update', auth.auth, auth.authAdmin, function (req, res) {
    let sessionmap = req.sessionmap;
    sessionmap.titleCourse = req.body.titleCourse;
    sessionmap.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});


module.exports = router;