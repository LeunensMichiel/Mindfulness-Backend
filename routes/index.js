let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');
let Exercise = mongoose.model('exercise');

router.get('/API/sessionmaps', function (req, res, next) {
    let query = Sessionmap.find().populate("sessions");
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }

        sessionmaps.forEach(function (element) {
            console.log(element);
        });

        res.json(sessionmaps);
    });


});

router.post('/API/sessionmap', function (req, res, next) {
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
            console.log(sessionmap);

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

router.get('/API/sessionmap/:sessionmap', function (req, res, next) {
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

router.get('/API/sessions/:sessionmapid', function (req, res, next) {
    res.json(req.sessions);
});

router.param('sessionmapid', function (req, res, next, id) {
    console.log("test");
    let query = Session.find({"sessionmap_id": id});
    query.exec(function (err, sessions) {
        if (err) {
            return next(err);
        }
        if (!sessions) {
            return next(new Error('not found ' + id));
        }
        req.sessions = sessions;
        return next();
    })
});

router.get('/API/session/:session', function (req, res, next) {
    res.json(req.session);
});

//werkt
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

router.get('/API/exercises/:exercise', function (req, res, next) {
    res.json(req.exercise);
});

router.param('exercise', function (req, res, next, id) {
    let query = Exercise.find({session_id: id});
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

router.get('/API/pages/:page', function (req, res, next) {
    res.json(req.pagess);
});

router.param('page', function (req, res, next, id) {
    let query = Page.find({exercise_id: id}).populate('paragraphs');

    query.exec(function (err, pages) {
        if (err) {
            return next(err);
        }
        if (!pages) {
            return next(new Error('not found ' + id));
        }
        req.pagess = pages;
        return next();
    });
});

// paragraph
router.get('/API/paragraphs/:paragraph', function (req, res, next) {
    res.json(req.paragraphs);
});

router.param('paragraphs', function (req, res, next, id) {
    let query = Paragraph.find({page_id: id});

    query.exec(function (err, paragraphs) {
        if (err) {
            return next(err);
        }
        if (!paragraphs) {
            return next(new Error('not found ' + id));
        }
        req.paragraphs = paragraphs;
        return next();
    });
});

module.exports = router;