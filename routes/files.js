let express = require('express');
let router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');


const Paragraphs = mongoose.model("paragraph");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
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

router.put("/API/paragraph/:paragraph", upload.single("paragraphImage"), (req, res, next) => {
    req.paragraph.pathname = req.file.path;

    req.paragraph.save(function (err, paragraph) {
        if (err) {
            return next(err);
        }

        res.json(paragraph);
    });
});

router.param('paragraph', function (req, res, next, id) {
    let query = Paragraphs.findById(id);

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

router.post('/API/file', function (req, res) {
    // We used this as reference: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
    const src = fs.createReadStream(req.body.path);
    src.pipe(res);

});

module.exports = router;