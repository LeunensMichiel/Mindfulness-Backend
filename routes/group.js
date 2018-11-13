let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Group = mongoose.model('group');

let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get('/groups', function (req, res, next) {
    let query = Group.find();
    query.exec(function (err, groups) {
        if (err) {
            return next(err);
        }
        res.json(groups);
    });
});

router.post('/group', function (req, res, next) {
    let group = new Group({
        name: req.body.name,
        sessionmap_id: req.body.sessionmap_id
    });
    group.save(function (err, group) {
        if (err) {
            return next(err);
        }
        res.json(group);
    });
});

module.exports = router;