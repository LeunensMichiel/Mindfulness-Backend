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


//versie2
router.post('/API/getpost', function (req, res, next) {
    let query = Post.findOne({"sessionmap_id":req.body.sessionmap_id,"session_id":req.body.session_id,
        "exercise_id":req.body.exercise_id,"page_id":req.body.page_id,"user_id": req.body.user_id});

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }

        if (!post) {
            let post = new Post({
                sessionmap_id: req.body.sessionmap_id,
                session_id: req.body.session_id,
                exercise_id: req.body.exercise_id,
                page_id: req.body.page_id,
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
        }
        else{
            res.json(post);
        }
    });
});



// werkt en wordt gebruikt
router.post('/API/post', function (req, res, next) {
    let post = new Post({
        sessionmap_id: req.body.sessionmap_id,
        session_id: req.body.session_id,
        exercise_id: req.body.exercise_id,
        page_id: req.body.page_id,
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

// werkt en wordt gebruikt
router.put('/API/post/:post', function(req,res,next){
    let post = req.post;
    post.sessionmap_id = req.body.sessionmap_id;
    post.session_id = req.body.session_id;
    post.exercise_id = req.body.exercise_id;
    post.page_id = req.body.page_id;
    post.inhoud = req.body.inhoud;
    post.afbeelding = req.body.afbeelding;
    post.user_id = req.body.user_id;

    post.save(function (err){
        if(err){
            return res.send(err);
        }
        res.json(req.post);
    })
});

// werkt en wordt gebruikt
router.param('post',function(req,res,next,id){
    let query = Post.findById(id);
    console.log(id);
    query.exec(function(err,post){
        if(err){
            return next(err);
        }
        if(!post){
            return next(new Error('not found '+id));
        }
        req.post = post;
        return next();
    })
});

module.exports = router;