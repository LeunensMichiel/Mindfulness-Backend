let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');
let Session = mongoose.model('session');


let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});



router.post('/API/session', function (req, res, next) {
    let session = new Session({
        title: req.body.title,
        position: req.body.position,
        sessionmap_id: req.body.sessionmap_id
    });

    session.save(function (err, session) {
        if (err) {
            return next(err);
        }

        let sessionQuery = Sessionmap.findById(session.sessionmap_id);
        sessionQuery.exec(function (err, sessionmap) {
            if (err) {
                return next(err);
            }

            sessionmap.sessions.push(session);

            sessionmap.save(function (err, sessonmap) {
                if (err) {
                    return next(err);
                }

                res.json(session);
            });
        });
    });
});

router.put('/API/session/:session', function (req, res, next) {
    let session = req.session;
    session.title = req.body.title;
    session.position = req.body.position;
    session.sessionmap_id = req.body.sessionmap_id;
    session.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});

router.get('/API/sessions/:sessionmapid', function (req, res, next) {
    res.json(req.sessions);
});

router.param('sessionmapid', function (req, res, next, id) {
    let query = Sessionmap.findById(id).populate('sessions');
    query.exec(function (err, sessionmap) {
        if (err) {
            return next(err);
        }
        if (!sessionmap) {
            return next(new Error('not found ' + id));
        }
        req.sessions = sessionmap.sessions;
        return next();
    })
});

router.get('/API/session/:session', function (req, res, next) {
    res.json(req.session);
});

router.delete('/API/session/:session', function (req, res) {
    req.session.remove(function (err) {
        if (err) {
            return next(err)
        }

        res.json(req.session);

    });
});

router.param('session', function (req, res, next, id) {
    let query = Session.findById(id);
    query.exec(function (err, session) {
        if (err) {
            return next(err);
        }
        if (!session) {
            return next(new Error('not found ' + id));
        }
        req.session = session;
        return next();
    })
});

module.exports = router;