


//Exercise


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

router.put('/API/page/:page', function(req, res ,next){
    console.log("1");
    req.page.title = req.body.title;
    req.page.pathAudio = req.body.pathAudio;
    req.page.description = req.body.description;
    req.page.position = req.body.position;
    req.page.exercise_id = req.body.exercise_id;
    console.log("2");
    req.page.save(function(err, page){
        if (err) {return next(err); }
        console.log("3");
        res.json(page);
    })
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





router.delete('/API/exercise/:excerciseWpages', function (req, res) {
    req.exercise.remove();
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









//Pages








module.exports = router;