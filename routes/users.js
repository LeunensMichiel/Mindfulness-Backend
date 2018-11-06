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


/*
 * The api calls creates a user
 * We will only need this api call to put user manually into the database
 */
router.post('/register', function (req, res, next) {

    if (!req.body.email || !req.body.password || !req.body.groups_code) {
        return res.status(400).json({message: 'email of wachtwoord of groups_code was niet ingevuld'});
    }

    let query = Group.findById(req.body.groups_code);
    query.exec(function(err, group){
        let user = new User();
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.rights = 2; // 2 = client, 1 = beheerder
        user.groups = group;
        user.setPassword(req.body.password);
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.json({token: user.generateJWT(),
                            _id: user._id})
        });
    });

});

router.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({token: user.generateJWT(),
                _id: user._id});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
