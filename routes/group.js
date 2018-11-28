let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let Group = mongoose.model('group');
let User = mongoose.model('user');
let Sessionmap = mongoose.model('sessionmap');

const emailServer = require("../config/mail_config");

let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get('/groups', auth, function (req, res, next) {
    let query = Group.find().populate({
        path: 'sessionmap_id',
        model: 'sessionmap',
        select: 'titleCourse'
    });
    query.exec(function (err, groups) {
        if (err) {
            return next(err);
        }

        console.log(groups);
        res.json(groups);
    });
});

router.post('/group', auth,  function (req, res, next) {
    let group = new Group({
        name: req.body.name,
        sessionmap_id: req.body.sessionmap._id
    });
    group.save(function (err, group) {
        if (err) {
            return next(err);
        }
        res.json(group);
    });
});

router.put('/group/:group', auth, function(req,res,next){
    let group = req.group;
    group.name = req.body.name;
    group.save(function (err){
        if(err){
            return res.send(err);
        }
        res.json(req.group);
    })
});

router.param('group', function(req,res,next,id){
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

router.delete('/group/:group',auth, function(req,res){
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

router.get('/group/sessionmaps', auth, function (req, res, next) {
    let query = Sessionmap.find({},{_id:true,titleCourse:true});
    query.exec(function (err, sessionmaps) {
        if (err) {
            return next(err);
        }
        res.json(sessionmaps);
    });
});

router.get('/group/getUsers/:group', auth, function (req, res, next) {
    let query = User.find({group:req.group},{_id:false,email:true});
    query.exec(function (err, users) {
        if (err) {
            return next(err);
        }
        res.json(users);
    });
});

// const email     = require("emailjs");


router.post('/group/sendmail', auth, function(req, res, next){

    const message	= {
        from:	    "mindfulness.beheerder@gmail.com",
        to:		    req.body.receiver,
        subject:	req.body.subject,
        attachment:
            [
                {data:`<html><b>${req.body.subject} </b><i></i> ${req.body.text}</html>`, alternative:true}
            ]
    };

    // send the message and get a callback with an error or details of the message that was sent
    emailServer.send(message, function(err, message) {

        if (err){
            return next(err);
        }

        res.send("Mail successvol verstuurd");
    });

});

module.exports = router;