let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let User = mongoose.model('user');

let auth = require('../config/auth_config');

/**
 * Deze api call geeft alle actieve beheerders terug
 */
router.get("/activeadmin", auth.auth, auth.authSuperAdmin, function (req, res, next) {
    let adminQuery = User.find(
        {
            $and: [
                {
                    admin_active: true
                },
                {
                    'roles.admin': true
                },
                {
                    "roles.super_admin": false
                }
            ]
        }, {
            _id: true,
            firstname: true,
            lastname: true,
            email: true,
            roles: true,
            admin_active: true
        },
        {
            sort: {
                email: -1
            }
        }
    );

    adminQuery.exec(function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
});

/**
 * Deze api call geeft alle niet actieve beheerders terug
 */
router.get("/nonactiveadmin", auth.auth, auth.authSuperAdmin, function (req, res, next) {
    let adminQuery = User.find(
        {
            $and: [
                {
                    admin_active: false
                },
                {
                    'roles.admin': true
                },
                {
                    "roles.super_admin": false
                }
            ]
        }, {
            _id: true,
            firstname: true,
            lastname: true,
            email: true,
            roles: true,
            admin_active: true
        }
    );

    adminQuery.exec(function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
});

/**
 * Deze api call (de)activeerd een beheerder
 */
router.put("/admin/:admin", auth.auth, auth.authSuperAdmin, function (req, res, next) {

    req.admin.admin_active = !req.admin.admin_active;
    req.admin.save(function(err, result) {
        if (err) {
            return next(err);
        }
        console.log(result);
        res.json(result);
    });
});

/**
 * Deze api call verwijderd een beheerder
 */
router.delete('/admin/:admin', auth.auth, auth.authSuperAdmin, function (req, res, next) {
    req.admin.remove(function (err) {
        if (err) return next(err);

        res.json({'message': 'Delete was successful'});

    });
});

router.param("admin", function (req, res, next, id) {
    let adminQuery = User.findById(id);
    adminQuery.exec(function (err, result) {
        if (err) {
            return next(err);
        }

        req.admin = result;
        return next();
    });
});

module.exports = router;
