let express = require('express');
let router = express.Router();
const multer = require('multer');
const fs = require('fs');

let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');
let Session = mongoose.model('session');


let jwt = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/session_image');
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


router.post('/session', auth, upload.single("session_image"), function (req, res, next) {
    let session = new Session(JSON.parse(req.body.session));
    session.path_image = req.file.path;
    session.save(function (err, session) {
        if (err) {
            console.log(err);
            return next(err);
        }


        let sessionmapQuerry = Sessionmap.updateOne({_id: req.body.sessionmap_id}, {'$push': {sessions: session}});

        sessionmapQuerry.exec(function (err, sessionmap) {
            if (err) {
                return next(err);
            }

            res.json(session);

        });
    });
});

router.put('/session/:session', auth, function (req, res, next) {
    let session = req.session;
    session.title = req.body.title;
    session.position = req.body.position;
    session.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});

router.get('/sessions/:sessionmapid', auth, function (req, res, next) {
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

router.get('/session/:session', auth, function (req, res, next) {
    res.json(req.session);
});

router.delete('/session/:session', auth,  function (req, res) {
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

router.get('/session_detailed/:session_with_childs',auth,  function(req, res) {
   res.json(req.session);
});

router.param('session_with_childs', function (req, res, next, id) {
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

        console.log(session);
        console.log(session.exercises);
        req.session = session;

        return next();
    })
});

module.exports = router;