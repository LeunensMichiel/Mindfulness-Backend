let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");

let User = mongoose.model('user');
let jwt = require('express-jwt');


let auth = jwt({
    secret: process.env.MINDFULNESS_BACKEND_SECRET,
    _userProperty: 'payload'
});

router.get("/activeadmin", auth, function (req, res, next) {
    let adminQuery = User.find(
        {
            $and: [
                {
                    admin_actif: true
                },
                {
                    'roles.admin': true
                }
            ]
        }, {
            _id: true,
            firstname: true,
            lastname: true,
            email: true,
            roles: true,
            admin_actif: true
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

router.get("/nonactiveadmin", auth, function (req, res, next) {
    let adminQuery = User.find(
        {
            $and: [
                {
                    admin_actif: false
                },
                {
                    'roles.admin': true
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

router.put("/admin/:admin", auth, function(req, res, next) {
    let adminQuery = User.findOneAndUpdate(
        {_id: req.params.admin},
        {"$set": {"admin_active": req.body.admin_active}},
        {new: true});

    adminQuery.exec(function(err, result){
        if (err) {
            return next(err);
        }

        res.json(result);
    });
});

router.delete('/admin/:admin', auth, function (req, res, next) {
    req.admin.remove(function (err) {
        if (err) return next(err);

        res.json({'message': 'Delete was successful'});

    });
});

router.param("admin", function(req, res, next, id) {
   let adminQuery = User.findById(id);

   adminQuery.exec(function(err, result){
      if (err) {
          return next(err);
      }

      req.admin = result;
   });
});

module.exports = router;