let jwt = require('express-jwt');


module.exports = {
    /**
     * Deze functie bekijkt of de user beheerders rechten heeft
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    authAdmin: function (req, res, next) {
        if (req.user.roles.admin || req.user.roles.super_admin) {
            return next();

        }

        res.status(401).end();

    },

    /**
     * Deze functie bekijkt of de user SuperAdmin rechten heeft
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    authSuperAdmin: function(req, res, next){
        if (req.user.roles.super_admin) {
            return next();
        }

        res.status(401).end();
    },

    /**
     * Controleert of user echt is
     */
    auth: jwt({
        secret: process.env.MINDFULNESS_BACKEND_SECRET,
        _userProperty: 'payload'
    })
};