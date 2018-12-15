let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('user');
let Group = mongoose.model('group');
let passport = require("passport");
const multer = require('multer');
let validator = require("email-validator");
const emailServer = require("../config/mail_config");


let auth = require('../config/auth_config');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profile_image');
    },
    filename: function (req, file, cb) {
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
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
    }

    if (!validator.validate(req.body.email)) {
        return res.status(400).json({message: 'Input invalid'});
    }

    let user = new User();
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.roles.client = true;
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
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
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
        return res.status(400).json({message: 'Input invalid'});
    }

    if (!validator.validate(req.body.email)) {
        return res.status(400).json({message: 'Input invalid'});
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

router.get('/user/:user', auth.auth, function (req, res, next) {
    res.json(req.paramUser)
})

router.get('/group/:user', auth.auth, function (req, res, next) {
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
        user.current_session_id = req.body.session_id;
        user.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({result: "geslaagd"});
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
        if (err) {
            return next(err)
        }
        req.paramUser.group = req.body.group_id;

        req.paramUser.save(function (err, user) {
            if (err) {
                return res.send(err);
            }
            res.json(group);
        })
    });
});

router.put('/user/:user/image', auth.auth, upload.single("file"), function (req, res, next) {
    User.findByIdAndUpdate(req.paramUser._id, {$set: {"image_file_name": req.file.filename}}, function (err, user) {
        if (err) {
            return next(err);
        }
        res.json(user)
    });
});

router.put('/change_email/:user', auth.auth, function (req, res, next) {

    let user = req.paramUser;

    if (!req.body.email) {
        return res.status(400).json({message: 'Input invalid'});
    }

    if (!validator.validate(req.body.email)) {
        return res.status(400).json({message: 'Input invalid'});
    }

    user.email = req.body.email;

    user.save(function (err, updatedUser) {
        if (err) {
            return next(err);
        }

        return res.json({
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

    });

});

router.put('/change_password/:user', auth.auth, function (req, res, next) {

    let user = req.paramUser;

    if (!req.body.new_password || !req.body.old_password) {
        return res.status(400).json({message: 'Input invalid'});
    }

    if (!user.validPassword(req.body.old_password)) {
        return res.status(401).json({message: 'Unauthorized!'});
    }

    user.setPassword(req.body.new_password);

    user.save(function (err, updatedUser) {
        if (err) {
            return next(err);
        }

        return res.json({
            token: updatedUser.generateJWT()
        });
    });

});

router.post('/change_password', function (req, res, next) {

    if (!req.body.new_password || !req.body.validation_code || !req.body.email) {
        return res.status(400).json({message: 'Input invalid'});
    }

    let getUserQuery = User.findOne({email: req.body.email, validation_code: req.body.validation_code});

    getUserQuery.exec(function (err, user) {
        if (err) {
            return next(err);
        }

        user.setPassword(req.body.new_password);

        user.save(function (err, updatedUser) {
            if (err) {
                return next(err);
            }

            return res.json({
                result: "Password updated!"
            });
        });
    });
});

router.post('/forgot_password', function (req, res, next) {

    if (!req.body.email) {
        return res.status(400).json({message: "Input invalid!"})
    }

    let validationCode = Math.floor(100000 + Math.random() * 900000);

    const message = {
        from: "mindfulness.beheerder@gmail.com",
        to: req.body.email,
        subject: "Wachtwoord vergeten",
        attachment:
            [
                {
                    data: `<html><body style="background-color: white"><h1 style="font-family: Arial;">Wachtwoord Wijzigen</h1><p style="font-family: Arial;">Code: <strong>${validationCode}</strong></p><p style="font-family: Arial;">Gelieve deze code in te vullen in de Mindfulness-app. Om uw wachtwoord te wijzigen.</p></body></html>`,
                    alternative: true
                }
            ]
    };

    // send the message and get a callback with an error or details of the message that was sent

    let userQuery = User.updateOne({email: req.body.email}, {$set: {"validation_code": validationCode}});

    userQuery.exec(function (err) {
        if (err) {
            return next(err);
        }

        emailServer.send(message, function (err, message) {

            if (err) {
                return next(err);
            }

            res.json({
                result: "Mail successvol verstuurd"
            });
        });
    });


});

module.exports = router;
