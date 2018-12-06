let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');

let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');
let Session = mongoose.model('session');
let Exercise = mongoose.model('exercise');
let Post = mongoose.model('post');
let User = mongoose.model('user');

let jwt = require('express-jwt');

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/post_image');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


//versie2
router.post('/getpost',auth, function (req, res, next) {
    let query = Post.findOne({
        "sessionmap_id": req.body.sessionmap_id, "session_id": req.body.session_id,
        "exercise_id": req.body.exercise_id, "page_id": req.body.page_id, "user_id": req.body.user_id
    });

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
        else {
            res.json(post);
        }
    });
});



// werkt en wordt gebruikt
router.post('/post', auth, function (req, res, next) {
    let post = new Post(req.body);
    post.save(function (err, post) {
        if (err) {
            return next(err);
        }
        User.findById(req.body.user_id, function (err, user) {
            if (err) {
                post.remove();
                return next(err);
            }
            user.posts.push(post)
            user.save(function (err, user) {
                if (err) { return next(err); }
                res.json(post);
            })
        })
    });
});

router.post('/post/image', auth, upload.single("file") ,function(req, res, next) {
    console.log(req.body)
    console.log(req.body.post)
    console.log(JSON.parse(req.body.post))
    console.log(req.body)
    console.log(req.file)
    console.log("1");
    let post = new Post(req.body);
    console.log("2");
    console.log(req.file.filename)
    post.image_file_name = req.file.filename
    console.log("3");
    post.save(function (err, post) {
        console.log("4");
        if (err) {
            console.log("-----------------ERROR_POST_SAVE_START-----------------")
            console.log(err);
            console.log("-----------------ERROR_POST_SAVE_END-----------------")
            return next(err);
        }
        console.log("5");
        User.findById(req.body.user_id, function (err, user) {
            console.log("6");
            if (err) {
                post.remove();
                console.log("-----------------ERROR_POST_FIND_USER_START-----------------")
                console.log(err);
                console.log("-----------------ERROR_POST_FIND_USER_END-----------------")
                return next(err);
            }
            console.log("7");
            user.posts.push(post)
            console.log("8");
            user.save(function (err, user) {
                console.log("9");
                if (err) { 
                    console.log("-----------------ERROR_USER_SAVE_START-----------------")
                    console.log(err);
                    console.log("-----------------ERROR_USER_SAVE_END-----------------")
                    return next(err); 
                }
                console.log("10");
                res.json(post);
            })
        })
    });
});

router.put('/post', function(req,res,next){
    Post.findByIdAndUpdate(req.body._id , req.body, function(err, post){
        if (err) { return next(err) }
        res.json(post)
    })
});

router.get('/checkpost/:post_page_id', function(req, res, next){
    res.json(req.post)
});

router.get('/post/:user', function(req, res, next){
    res.json(req.user.posts)
});

// werkt en wordt gebruikt
router.put('/post/:post',auth, function (req, res, next) {
    let post = req.post;
    post.sessionmap_id = req.body.sessionmap_id;
    post.session_id = req.body.session_id;
    post.exercise_id = req.body.exercise_id;
    post.page_id = req.body.page_id;
    post.inhoud = req.body.inhoud;
    post.afbeelding = req.body.afbeelding;
    post.user_id = req.body.user_id;

    post.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json(req.post);
    })
});

// werkt en wordt gebruikt
router.param('post', function (req, res, next, id) {
    let query = Post.findById(id);
    console.log(id);
    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('not found ' + id));
        }
        req.post = post;
        return next();
    })
});

router.param('post_page_id', function(req, res, next, id){
    let query = Post.findOne({'page_id': id});
    query.exec(function(err, post){
        if (err) { return next(err); }
        if (!post) { req.post = { '_id': 'none' }}
        if (post) { req.post = post }
        return next();
    });
});

router.param('user', function(req, res, next, id) {
    let query = User.findById(id)
        .populate('posts')
    query.exec(function(err, user){
        if (err) { return next(err) }
        req.user = user
        return next()
    });
})

module.exports = router;