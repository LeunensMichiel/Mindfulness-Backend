let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('user');
let Group = mongoose.model('group');
let passport = require("passport");
let jwt = require('express-jwt');

/*
 * TODO We should use Aoth2.0 for third party login
 * http://www.passportjs.org/docs/oauth2-api/
 */

let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});
/*
 * The api calls creates a user
 * For android application as role 'client'
 * We will only need this api call to put user manually into the database
 */
router.post('/register', function (req, res, next) {

    if (!req.body.email || !req.body.password || !req.body.groups_code) {
        return res.status(400).json({ message: 'email of wachtwoord of groups_code was niet ingevuld' });
    }

    let query = Group.findById(req.body.groups_code);
    query.exec(function (err, group) {
        let user = new User();
        //user.firstname = req.body.firstname;
        //user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.roles.client = true;
        user.group = group;
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

});

router.post('/login', function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'email of wachtwoord was niet ingevuld' });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json(info);
        }

        if (!user.roles.client) {
            return res.status(401).json(info);
        }
        if (user) {
            return res.json({
                token: user.generateJWT(),
                _id: user._id,
                unlocked_sessions: user.unlocked_sessions,
                current_session_id: user.current_session_id,
                current_exercise_id: user.current_exercise_id,
                post_ids: user.posts,
                group: user.group
            });
        } else {
            return res.status(401).json(info);
        }
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

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
    }

    let user = new User();
    // user.firstname = req.body.firstname;
    // user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.roles.admin = true;
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

router.get('/user/:user',auth, function (req, res, next) {
    console.log(req.paramUser);
    res.json(req.paramUser)
})

router.get('/group/:user',auth, function (req, res, next) {
    console.log(req.paramUser)
    console.log(req.paramUser.group);
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

router.post('/user', auth, function (req, res, next) {
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

router.put('/user/feedback', auth, function (req, res, next) {
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
    // console.log(req);
    // req.user.feedbackSubscribed = req.body.feedbackSubscribed;
    // console.log(req.user);
    // req.user.save(function (err) {
    //     if (err) {
    //         return res.send(err);
    //     }
    //     res.json({result: "geslaagd"});
    // });
});router.put('/user/:user', function (req, res, next) {
    req.paramUser.group = req.body.group_id;

    req.paramUser.save(function (err, user) {
        if (err) {
            return res.send(err);
        }
        res.json(user);
    })
});

module.exports = router;
