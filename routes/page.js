let express = require('express');
let router = express.Router();

let auth = require('../config/auth_config');

const multer = require('multer');

let mongoose = require("mongoose");

let Page = mongoose.model('page');
let Exercise = mongoose.model('exercise');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/page_audio');
    },
    filename: function (req, file, cb) {
        cb(null, (new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname).replace(" ", ""));
    }
});

const audioFileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'audio/mpeg' ||
        file.mimetype == 'audio/mp3' ||
        file.mimetype == 'audio/aac' ||
        file.mimetype == 'audio/x-aac' ||
        file.mimetype == 'audio/wav' ||
        file.mimetype == 'audio/wave'
    ) {
        cb(null, true);
    }
    else
    {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: audioFileFilter
});

const storageParagraph = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/paragraphs_image');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname);
    }
});



const imagefileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    }
    else
    {
        cb(null, false)
    }
};


const uploadParagraph = multer({
    storage: storageParagraph,
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imagefileFilter
});


router.get('/pages/:exercise_id', auth.auth, function (req, res, next) {
    res.json(req.pagess);
});

router.post('/page', auth.auth, auth.authAdmin, function (req, res, next) {
    let page = new Page(req.body);

    page.save(function (err, page) {
        if (err) {
            return next(err);
        }

        let exerciseQuery = Exercise.updateOne({_id: req.body.exercise_id}, {'$push': {pages: page}});
        exerciseQuery.exec(function (err, exercise) {
            if (err) {
                return next(err);
            }
            res.json(page);
        });
    });
});

router.post('/page/changepos', auth.auth, auth.authAdmin, function (req, res, next) {
    let pageQuery = Page.updateOne({_id: req.body.page1._id}, {'$set': {position: req.body.page1.position}});
    pageQuery.exec(function (err, result) {
        if (err) {
            return next(err);
        }
        let page2Query = Page.updateOne({_id: req.body.page2._id}, {'$set': {position: req.body.page2.position}});
        page2Query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        });
    });
});

router.put('/page/:page', auth.auth, auth.authAdmin, function (req, res, next) {

    req.page.title = req.body.title;
    req.page.path_audio = req.body.path_audio;
    req.page.description = req.body.description;
    req.page.position = req.body.position;
    req.page.type_input = req.body.type_input;
    req.page.paragraphs = req.body.paragraphs;
    req.page.multiple_choice_items = req.body.multiple_choice_items;

    req.page.save(function (err, page) {
        if (err) {
            return next(err);
        }

        res.json(page);
    })
});

router.put('/pagefile/:page_with_audio', auth.auth, auth.authAdmin, upload.single("page_file"), function (req, res, next) {

    if (!req.file) {
        return next(new Error("Wrong file type!"));
    }

    let pageQuery = Page.findOneAndUpdate(
        {_id: req.params.page_with_audio},
        {$set: {"audio_filename": req.file.filename}},
        {new: true}
    );

    pageQuery.exec(function (err, page) {
        if (err) {
            return next(err);
        }

        res.json(page);
    });
});

router.put('/pagefileparagraph/:page_with_paragraph', auth.auth, auth.authAdmin, uploadParagraph.single("page_file"), function (req, res, next) {

    if (!req.file) {
        return next(new Error("Wrong file type!"));
    }

    let pageQuery = Page.findOneAndUpdate(
        {_id: req.params.page_with_paragraph, "paragraphs.position": req.body.par_pos},
        {$set: {"paragraphs.$.image_filename": req.file.filename}},
        {new: true}
    );


    pageQuery.exec(function (err, page) {
        if (err) {
            return next(err);
        }

        res.json(page);
    });
});

router.delete('/page/:page', auth.auth, auth.authAdmin, function (req, res, next) {
    req.page.remove(function (err) {
        if (err) return next(err);

        res.json({'message': 'Delete was successful'});

    });

});

router.param('exercise_id', function (req, res, next, id) {
    let query = Exercise.findById(id).populate('pages');

    query.exec(function (err, exercise) {
        if (err) {
            return next(err);
        }
        if (!exercise) {
            return next(new Error('not found ' + id));
        }
        req.pagess = exercise.pages;
        return next();
    });
});

router.param('page', function (req, res, next, id) {
    let query = Page.findById(id);
    query.exec(function (err, page) {
        if (err) {
            return next(err);
        }
        if (!page) {
            return next("Page not found id: " + id);
        }
        req.page = page;
        return next();
    });
});

module.exports = router;