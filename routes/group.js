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
        sessionmap_id: req.body.sessionmap._id,
        actief:false
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
    if(req.body.name){
        group.name = req.body.name;
    }
    if(req.body.actief != null){
        group.actief = req.body.actief;
    }
    if(req.body.notification){
        group.notifications.push(req.body.notification);
    }
    if(req.body.sessionmap_id)
    {
        group.sessionmap_id = req.body.sessionmap_id;
    }
    group.save(function (err){
        if(err){
            return res.send(err);
        }
        res.json(req.group);
    })
});

router.put('/group/sendNotification/:group', auth, function(req,res,next){
    let group = req.group;
    if(req.body.notification){
        group.notifications.push(req.body.notification);
    }
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
    // let query = User.find({group:req.group},{_id:false,email:true,firstname:true,lastname:true});
    let query = User.find({group:req.group},{_id:true,email:true,firstname:true,lastname:true})
    .populate({
     path: 'current_session_id',
     model: 'session',
     select: 'title'
 });
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

router.get('/group/getPossibleUsers/:group', auth, function (req, res, next) {
    let query = User.find({$and:[{group:{$nin:[req.group._id]}},{'roles.client':{$in:[true]}}]},{_id:true,firstname:true,lastname:true});

     query.exec(function (err, users) {
         if (err) {
             return next(err);
         }
         res.json(users);
     });
 });

 router.post('/group/addMyUserToMyGroup', auth, function(req,res,next){
    let arrayUsers = req.body.users;
    console.log(arrayUsers);
    let groep = req.body.group;
    console.log(groep);
    let query = User.updateMany({_id:{$in:arrayUsers}},{$set:{group:groep,current_session_id:null}});
    query.exec(function(err,result){
      if(err){
          return next(err);
      }
      console.log(result);
      //res.end();
      res.json({resultaat:"ok"});
  })
});

// api call om meerdere users te verwijderen uit een groep:
router.post('/group/deleteUserFromGroup', auth, function(req,res,next){
  let arrayUsers = req.body.users;
  console.log(arrayUsers);
  //let groep = req.body.group;
  //console.log(groep);
  let query = User.updateMany({_id:{$in:arrayUsers}},{$set:{group:null,current_session_id:null}});
  query.exec(function(err,result){
    if(err){
        return next(err);
    }
    console.log(result);
    //res.end();
    //res.send("ok");
    res.json({resultaat:"ok"});
})
});

module.exports = router;