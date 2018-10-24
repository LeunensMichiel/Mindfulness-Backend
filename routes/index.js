let express = require('express');
let router = express.Router();

let mongoose = require("mongoose");
let Sessionmap = mongoose.model('sessionmap');
let Page = mongoose.model('page');

router.get('/API/sessionmaps', function(req, res, next) {
  let query = Sessionmap.find({}, {sessions:true});


  query.exec(function(err, sessionmaps) {
    if (err) {
      return next(err);
    }
    res.json(sessionmaps);
  });
});
router.post('/API/sessionmaps/', function (req, res, next) {
  //werkt nog niet, want we werken niet met sessionmaps of ID,s
    let sessie = new Sessie({
      title: req.body.title
    });
    sessie.save(function (err, post) {
      if (err) {
        return next(err);
      }
      res.json(post);
    });

});
router.get('/API/sessionmap/:sessionmap', function (req, res, next) {
    res.json(req.sessionmap);
});

router.param('sessionmap', function (req, res, next, id) {
    let query = Sessionmap.findById(id);
    query.exec(function (err, sessionmap) {
        if (err) {
            return next(err);
        }
        if (!sessionmap) {
            return next(new Error('not found ' + id));
        }
        req.sessionmap = sessionmap;
        return next();
    })
});

router.get('/API/exercise/:exercise', function(req, res, next){
    res.json(req.exercise);
});

router.param('exercise', function (req, res, next, id) {
    let query = Page.find({exercise_id: id});
    query.exec(function (err, exercise) {
        if (err) {
            return next(err);
        }
        if (!exercise) {
            return next(new Error('not found ' + id));
        }
        req.exercise = exercise;
        return next();
    })
});



module.exports = router;