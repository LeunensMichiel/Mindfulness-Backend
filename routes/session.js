let express = require('express');
let router = express.Router();
const multer = require('multer');


let mongoose = require("mongoose");

let Sessionmap = mongoose.model('sessionmap');
let Session = mongoose.model('session');

let auth = require('../config/auth_config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/session_image');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.post('/session', auth.auth, auth.authAdmin, upload.single("session_image"), function (req, res, next) {

    if (!req.file) {
        return next(new Error("Wrong file type!"));
    }

    let session = new Session(JSON.parse(req.body.session));
    session.image_filename = req.file.filename;
    session.save(function (err, session) {
        if (err) {
            console.log(err);
            return next(err);
        }


        let sessionmapQuerry = Sessionmap.updateOne({_id: req.body.sessionmap_id}, {'$push': {sessions: session}});

        sessionmapQuerry.exec(function (err, sessionmap) {
            let sessionmapError = err;
            if (err) {
                session.remove(function (err, session) {
                    if (err) {
                        return next(err);
                    }

                    return next(err);
                });

            }

            res.json(session);

        });
    });
});

router.put('/session/:session', auth.auth, auth.authAdmin, function (req, res, next) {
    let session = req.session;
    session.title = req.body.title;
    session.description = req.body.description;
    session.position = req.body.position;
    session.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});

router.put('/sessionWithImage/:session', auth.auth, auth.authAdmin, upload.single("session_image"), function (req, res, next) {
    if (!req.file) {
        return next(new Error("Wrong file type!"));
    }

    let session = req.session;
    session.title = JSON.parse(req.body.session).title;
    session.description = JSON.parse(req.body.session).description;
    session.position = JSON.parse(req.body.session).position;
    session.image_filename = req.file.filename;
    session.save(function (err, result) {
        if (err) {
            return res.send(err);
        }
        res.json(result);
    })

});

router.get('/sessions/:sessionmapid', auth.auth, function (req, res, next) {
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

router.get('/session/:session', auth.auth, function (req, res, next) {
    res.json(req.session);
});

router.delete('/session/:session', auth.auth, auth.authAdmin, function (req, res) {
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

router.get('/session_detailed/:session_with_childs', auth.auth, auth.authAdmin, function (req, res) {
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