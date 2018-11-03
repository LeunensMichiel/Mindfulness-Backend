var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');


passport.use(new LocalStrategy({
        /*
         * Because we use email instead of username as identifier
         * We need to tell passport specifically to look for the email field en not for the username field
         */
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            return done(null, user);
        });
    }));