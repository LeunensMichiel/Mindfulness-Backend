let express = require('express');
let router = express.Router();

const fs = require('fs');

let auth = require('../config/auth_config');

router.get('/file', auth.auth, function (req, res, next) {

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

module.exports = router;