let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Group = mongoose.model('group');
let User = mongoose.model('user');
let Sessionmap = mongoose.model('sessionmap');

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

router.put('/group/:group',function(req,res,next){
    let group = req.group;
    group.name = req.body.name;
    group.save(function (err){
        if(err){
            return res.send(err);
        }
        res.json(req.group);
    })
});

router.param('group',function(req,res,next,id){
    let query = Group.findById(id);
    query.exec(function(err,group){
        if(err){
            return next(err);
        }
        if(!group){
            return next(new Error('not found '+id));
        }
        req.group = group;
        return next();
    })
});

router.delete('/group/:group',function(req,res){
    let group = req.group;
    let idvangroep = req.group.id;
    
    req.group.remove(function(err){
        if(err){
            return next(err)
        }
    }); 

    let query = User.updateMany({group:idvangroep},{'$set': {group:null}});
    res.json(req.group);
});

router.get('/group/sessionmaps', function (req, res, next) {
    let query = Sessionmap.find({},{_id:true,titleCourse:true});
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }
        res.json(sessionmaps);
    });
});

module.exports = router;