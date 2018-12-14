let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
const multer = require('multer');

let Post = mongoose.model('post');
let User = mongoose.model('user');

let auth = require('../config/auth_config');

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
router.post('/getpost', auth.auth, function (req, res, next) {
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
router.post('/post', auth.auth, function (req, res, next) {
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
                if (err) {
                    return next(err);
                }
                res.json(post);
            })
        })
    });
});

router.post('/post/image', auth.auth, upload.single("file"), function (req, res, next) {
    var tempPost = JSON.parse(req.body.post)
    let post = new Post(tempPost);
    post.image_file_name = req.file.filename
    post.save(function (err, post) {
        if (err) {
            return next(err);
        }
        User.findById(post.user_id, function (err, user) {
            if (err) {
                post.remove();
                return next(err);
            }
            user.posts.push(post);
            user.save(function (err, post) {
                if (err) {
                    return next(err);
                }
                res.json(post);
            })
        })
    });
});

router.put('/post/image/:post_image_id', auth.auth, upload.single("file") ,function(req, res, next) {
    console.log(req.file.filename);
    User.findByIdAndUpdate(req.body._id,  { image_file_name :req.file.filename }, function (err, post) {
        if (err) { return next(err); }
        console.log(post);
        res.json({"message": "WUK"});
    })
});

router.put('/post', auth.auth, function(req,res,next){
    Post.findByIdAndUpdate(req.body._id , req.body, function(err, post){
        if (err) { return next(err) }
        res.json(post)
    })
});

router.get('/checkpost/:post_page_id', auth.auth, function (req, res, next) {
    res.json(req.post)
});

router.get('/post/:user', auth.auth, function (req, res, next) {
    res.json(req.user.posts)
});

// werkt en wordt gebruikt
router.put('/post/:post', auth.auth, function (req, res, next) {
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

router.param('post_page_id', function (req, res, next, id) {
    let query = Post.findOne({'page_id': id});
    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            req.post = {'_id': 'none'}
        }
        if (post) {
            req.post = post
        }
        return next();
    });
});

router.param('user', function (req, res, next, id) {
    let query = User.findById(id)
        .populate('posts')
    query.exec(function (err, user) {
        if (err) {
            return next(err)
        }
        req.user = user
        return next()
    });
})

module.exports = router;