let express = require('express');
let router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
let jwt = require('express-jwt');


let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});
//
//
// const Paragraphs = mongoose.model("paragraph");
//
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/paragraphs_image');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });
//
// // through this variable we filter what files we accept and what not
// // const fileFilter = (req, file, cb) => {
// //
// // }
//
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10
//     }
// });
//
// router.put("/API/paragraph/:paragraph", upload.single("paragraphImage"), (req, res, next) => {
//     req.paragraph.pathname = req.file.path;
//
//     req.paragraph.save(function (err, paragraph) {
//         if (err) {
//             return next(err);
//         }
//
//         res.json(paragraph);
//     });
// });
//
// router.param('paragraph', function (req, res, next, id) {
//     let query = Paragraphs.findById(id);
//
//     query.exec(function (err, paragraph) {
//         if (err) {
//             return next(err);
//         }
//         if (!paragraph) {
//             return next(new Error('not found ' + id));
//         }
//         req.paragraph = paragraph;
//         return next();
//     });
// });

router.get('/file', function (req, res, next) {
    // We used this as reference: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93



    if (req.query.object_type && req.query.file_name) {


        let fileReader = fs.createReadStream(`uploads/${req.query.object_type}/${req.query.file_name}`);

        fileReader.on('error', function (err) {
            console.log('fileread failed');
            res.statusCode = 400;
            res.end(`error: ${err.message}`);

        });

        fileReader.pipe(res);

    } else {
        res.statusCode = 400;
        res.end(`error: file not found`);
    }

});

//
// router.get('/file/:pad', function (req, res) {
//     // We used this as reference: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
//
//
//     try {
//         const src = fs.createReadStream("uploads/session_image/" + req.filename);
//         src.pipe(res);    }
//     catch(err) {
//         res.json({err: err});
//     }
//
// });
//
// router.param('pad', function(req, res, next, filename) {
//
//     req.filename = filename;
//
//     return next();
// });


//
module.exports = router;