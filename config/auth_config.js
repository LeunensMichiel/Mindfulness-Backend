let jwt = require('express-jwt');


module.exports = {
    authAdmin: function (req, res, next) {
        if (req.user.roles.admin || req.user.roles.super_admin) {
            return next();

        }

        res.status(401).end();

    },

    authSuperAdmin: function(req, res, next){
        if (req.user.roles.super_admin) {
            return next();
        }

        res.status(401).end();
    },

    auth: jwt({
        secret: process.env.MINDFULNESS_BACKEND_SECRET,
        _userProperty: 'payload'
    })
};