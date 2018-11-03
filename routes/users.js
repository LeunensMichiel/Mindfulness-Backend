var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('user');
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

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'email of wachtwoord was niet ingevuld'});
    }

    let user = new User();
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({token: user.generateJWT()})
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
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
