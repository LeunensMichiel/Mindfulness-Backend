let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('user');
let Group = mongoose.model('group');
let passport = require("passport");
const multer = require('multer');

let auth = require('../config/auth_config');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profile_image');
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
/**
 * The api calls creates a user
 * For android application as role 'client'
 * We will only need this api call to put user manually into the database
 */
router.post('/register', function (req, res, next) {
    if (!req.body.email || !req.body.password ) {
        return res.status(400).json({ message: 'email of wachtwoord was niet ingevuld' });
    }
    console.log("1");
    let user = new User();
    console.log("2");
    user.email = req.body.email;
    console.log("3");
    user.roles.client = true;
    console.log("4");
    user.setPassword(req.body.password);
    user.feedbackSubscribed = true;
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({
            token: user.generateJWT(),
            _id: user._id
        })
    });
});

router.post('/login', function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'email of wachtwoord was niet ingevuld' });
    }
    console.log("1")
    passport.authenticate('local', function (err, user, info) {
        console.log("2")
        if (err) {
            return next(err);
        }
        console.log("3")
        if (!user) {
            return res.status(401).json(info);
        }
        console.log("4")
        if (!user.roles.client) {
            return res.status(401).json(info);
        }
        console.log("5")
        if (user) {

        console.log("6")
            return res.json({
                //Aangepast door Michiel op 30/11 om bugs proberen op te lossen van userInfo
                token: user.generateJWT(),
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                unlocked_sessions: user.unlocked_sessions,
                current_session_id: user.current_session_id,
                current_exercise_id: user.current_exercise_id,
                post_ids: user.posts,
                group: user.group,
                feedbackSubscribed: user.feedbackSubscribed
            });
        } else {
            return res.status(401).json(info);
        }
        console.log("7")
    })(req, res, next);
});

router.post('/login/admin', function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json(info);
        }
        if (!user.roles.admin && !user.roles.super_admin) {
            return res.status(401).json(info);
        }
        return res.json({
            token: user.generateJWT()
        });
    })(req, res, next);
});

/**
 * The api calls creates a user
 * For angular application as 'admins'
 * We will only need this api call to put user manually into the database
 */
router.post('/register/admin', function (req, res, next) {

    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
        return res.status(400).json({message: 'email of wachtwoord of voornaam of achternaam was niet ingevuld'});
    }

    let user = new User(req.body);
    user.roles.admin = true;
    user.admin_active = false;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({
            token: user.generateJWT(),
            _id: user._id
        })
    });
});

router.post('/checkemail', function (req, res, next) {
    User.find({email: req.body.email},
        function (err, result) {
            if (result.length) {
                res.json({'email': 'alreadyexists'})
            } else {
                res.json({'email': 'ok'})
            }
        });
});

router.get('/user/:user',auth.auth, function (req, res, next) {
    res.json(req.paramUser)
})

router.get('/group/:user',auth.auth, function (req, res, next) {
    res.json(req.paramUser.group)

})

router.param('user', function (req, res, next, id) {

    let query = User.findById(id).populate("group");

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('not found' + id));
        }

        req.paramUser = user;
        return next();
    })
});

router.post('/user', auth.auth, function (req, res, next) {
    let query = User.findById(req.body.id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('not found' + id));
        }

        user.unlocked_sessions.push(req.body.session_id);
        user.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({ result: "geslaagd" });
        });
    });
});

router.put('/user/feedback', auth.auth, function (req, res, next) {
    let query = User.findById(req.body._id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error('not found' + id));
        }

        user.feedbackSubscribed = req.body.feedbackSubscribed;
        user.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({result: "geslaagd"});
        });
    });

});

router.put('/user/:user', auth.auth, function (req, res, next) {
    Group.findById(req.body.group_id, function (err, group) {
            if (err) { return next(err) }
    req.paramUser.group = req.body.group_id;

   req.paramUser.save(function (err, user) {
               if (err) {
                   return res.send(err);
               }
               console.log(user.group);
               res.json(group);
           })
});

router.put('/user/:user/image', auth.auth, upload.single("file") ,function(req, res, next) {
    User.findByIdAndUpdate(req.paramUser._id, { $set: { "image_file_name":req.file.filename } }, function(err, user){
        if (err) { return next(err); }
        res.json(user)
    });
});

module.exports = router;
