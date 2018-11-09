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

router.get('/API/sessionmaps', function (req, res, next) {
    let query = Sessionmap.find().populate("sessions");
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }
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

router.delete('/API/sessionmap/:sessionmap', function (req, res) {
    Sessionmap.remove({ _id: { $in: req.sessionmap.sessions } }, function (err) {
        if (err) return next(err);
        req.sessionmap.remove(function (err) {
            if (err) {
                return next(err);
            }
            res.json(req.sessionmap);
        });
    });
});

router.put('/API/sessionmap/:sessionmap/update', function (req, res) {
    let sessionmap = req.sessionmap;
    sessionmap.titleCourse = req.body.titleCourse;
    sessionmap.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
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
    let query = Session.find({ "sessionmap_id": id });
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

router.get('/API/sessions', function (req, res, next) {
    let query = Session.find();
    query.exec(function (err, sessies) {
        if (err) {
            return next(err);
        }

        sessies.forEach(function (element) {
            console.log(element);
        });

        res.json(sessies);
    });


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


router.delete('/API/session/:session', function (req, res) {
    req.session.remove(function (err) {
        if (err) {
            return next(err)
        }
        res.json(req.session);
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

router.post('/API/session/:session/exercises', function (req, res, next) {
    let ex = new Exercise(req.body);
    ex.ses
});

//Exercise
router.get('/API/exercises/:session', function (req, res, next) {
    res.json(req.exercise);
});

router.get('/API/exerciseWpages/:excerciseWpages', function (req, res, next) {
    res.json(req.exercise);
});

router.param('excerciseWpages', function (req, res, next, id) {
    let query = Exercise.findOne({ _id: id })
        .populate({
            path: 'pages',
            populate: {
                path: 'paragraphs',
                model: 'paragraph'
            }
        });
    query.exec(function (err, ex) {
        if (err) {
            return next(err);
        }
        if (!ex) {
            return next(new Error('not found ' + id));
        }
        req.exercise = ex;
        return next();
    })
});

router.post('/API/exerciseWpages', function (req, res, next) {
    let ex = new Exercise({
        title: req.body.title,
        position: req.body.position,
        session_id: req.body.session_id
    });
    ex.save(function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

router.post('/API/exercise/:excerciseWpages/page', function (req, res, next) {
    Paragraph.insertMany(req.body.paragraphs, function (err, pars) {
        if (err) { return next(err); }
        req.body.paragraphs = [];
        let page = new Page(req.body);
        for (var i = 0; i < pars.length; i++) {
            page.paragraphs.push(pars[i]);
        }
        page.exercise_id = req.exercise._id;
        page.save(function (err, page) {
            if (err) {
                return next(err);
            }
            req.exercise.pages.push(page);
            req.exercise.save(function (err, ex) {
                if (err) { return next(err); }
                res.json(page);
            })
        });
    });
});

router.post('/API/page/:page/paragraph', function (req, res, next) {
    let par = new Paragraph();
    par.position = req.body.position;
    par.type = req.body.type;
    par.filename = req.body.filename;
    par.pathname = req.body.pathname;
    par.description = req.description;
    par.save(function (err, par) {
        if (err) { return next(err); }
        req.page.paragraphs.push(par);
        req.page.save(function (err, page) {
            if (err) { return next(err); }
            res.json(page);
        });
    })
});

router.delete('/API/page/:page', function (req, res, next) {
    var parids = [];
    for (var i = 0; i < req.page.paragraphs.length; i++) {
        parids.push(req.page.paragraphs[i]._id);
    }
    Paragraph.deleteMany({ "_id": parids }, function (err, pars) {
        if (err) { return next(err); }
        Page.findByIdAndDelete(req.page._id, function (err, data) {
            if (err) { return next(err); }
            res.json(data);
        });
    });
});

router.param('page', function (req, res, next, id) {
    let query = Page.findById(id, function (err, page) {
        if (err) { return next(err); }
        if (!page) { return next("Page not found id: " + id); }
        req.page = page;
        return next();
    });
});

router.delete('/API/exercise/:excerciseWpages', function (req, res) {
    var pageids = [];
    var parids = [];
    for (var i = 0; i < req.exercise.pages.length; i++) {
        pageids.push(req.exercise.pages[i]._id);
        if (req.exercise.pages[i].type === "TEXT") {
            for (var x = 0; x < req.exercise.pages[i].paragraphs.length; x++) {
                parids.push(req.exercise.page[i].paragraphs[x]._id);
            }
        }
    }
    Paragraph.deleteMany({ "_id": parids }, function (err, pars) {
        if (err) { return next(err); }
        Page.deleteMany({ "_id": pageids }, function (err, pages) {
            if (err) { return next(err); }
            Exercise.deleteOne({ "_id": req.exercise._id }, function (err, ex) {
                if (err) { return next(err); }
                res.json(ex);
            })
        });
    });
})

router.post('/API/exercise/:excerciseWpages', function (req, res, next) {
    var pars = [];
    for (var i = 0; i < req.body.pages.length; i++) {
        if (req.body.pages[i].type == "TEXT") {
            pars.push({
                position: i,
                paragraphs: req.body.pages[i].paragraphs
            })
        }
        req.body.pages[i].paragraphs = [];
    }
    req.exercise.title = req.body.title;
    req.exercise.position = req.body.position;
    Page.deleteMany({ "exercise_id": req.exercise._id }, function (err, delPages) {
        if (err) { return next(err); }
        Page.insertMany(req.body.pages, function (err, pages) {
            if (err) { return next(err); }
            req.exercise.pages = [];
            for (var i = 0; i < req.body.pages.length; i++) {
                req.exercise.pages.push(pages[i]);
            }
            for (var i = 0; i < pars.length; i++) {
                Paragraph.insertMany(pars[i].paragraphs, function (err, paragraphs) {
                    for (var x = 0; x < paragraphs.length; x++) {
                        req.exercise.pages[pars[x].position].paragraphs.push(paragraphs[x]);
                        req.exercise.pages[pars[x].position].save(function (err, page) {
                            if (err) { return next(err); }
                        });
                    }
                    req.exercise.save(function (err, ex) {
                        if (err) { return next(err); }
                        res.json(ex);
                    });
                });
            }

        });
    });
});

router.param('emptyExercise', function (req, res, next, id) {
    let query = Exercise.findOne({ _id: id });
    query.exec(function (err, ex) {
        if (err) {
            return next(err);
        }
        if (!ex) {
            return next(new Error("Exercise not found id: " + id));
        }
        req.exercise = ex;
        return next();
    })
})

router.get('/API/exercise/:exercise', function (req, res, next) {
    res.json(req.exercise);
})

router.param('exercise', function (req, res, next, id) {
    let query = Exercise.find({ session_id: id }).populate({
        path: 'pages',
        populate: {
            path: 'paragraphs',
            model: 'paragraph'
        }
    });
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

router.delete('/API/exercises/:exercise', function (req, res) {
    Exercise.remove({ _id: { $in: req.exercise.pages } }, function (err) {
        if (err) return next(err);
        req.exercise.remove(function (err) {
            if (err) {
                return next(err)
            }
            res.json(req.exercise);
        });
    });
});

router.put('/API/exercise/:exercise', function (req, res, next) {
    let exercise = req.exercise;
    exercise.title = req.body.title;
    exercise.position = req.body.position;
    exercise.session_id = req.body.session_id;
    exercise.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.body);
    })
});

//Pages
router.get('/API/pages/:page', function (req, res, next) {
    res.json(req.pagess);
});

router.param('page', function (req, res, next, id) {
    let query = Page.find({ exercise_id: id }).populate('paragraphs');

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

//post
// werkt
router.get('/API/posts', function (req, res, next) {
    let query = Post.find();
    query.exec(function (err, posts) {
        if (err) {
            return next(err);
        }

        posts.forEach(function (element) {
            console.log(element);
        });

        res.json(posts);
    });
});

// werkt nog niet?!
router.get('/API/posts/:userid', function (req, res, next) {
    res.json(req.posts);
});

router.param('userid', function (req, res, next, id) {
    console.log("test");
    let query = Post.find({ "user_id": id });

    query.exec(function (err, posts) {
        if (err) {
            return next(err);
        }
        if (!posts) {
            return next(new Error('not found ' + id));
        }
        req.posts = posts;
        return next();
    });
});

// get post met al die id's
router.post('/API/getpost', function (req, res, next) {
    let query = Post.findOne({
        "sessionmap_id": req.body.sessionmap_id, "session_id": req.body.session_id,
        "exercise_id": req.body.exercise_id, "page_id": req.body.page_id, "user_id": req.body.user_id
    });

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('not found ' + id));
        }
        res.json(post);
    });

});

// werkt
router.post('/API/post', function (req, res, next) {
    let post = new Post({
        sessionmap_id: req.body.sessionmap_id,
        session_id: req.body.session_id,
        exercise_id: req.body.exercise_id,
        page_id: req.body.exercise_id,
        inhoud: req.body.inhoud,
        afbeelding: req.body.afbeelding,
        user_id: req.body.user_id
    });

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }

        let postQuery = User.findById(post.user_id);
        postQuery.exec(function (err, user) {
            if (err) {

                return next(err);
            }
            console.log(user);

            user.posts.push(post);

            user.save(function (err, user) {
                if (err) {
                    return next(err);
                }
                res.json(post);
            });
        });
    });
});

module.exports = router;