var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/API/mindfulness', function(req, res, next) {
  res.json({
      test: "hello android"
  });
});

router.post('/API/mindfulness', function(req, res, next) {
    let tmp = req.body.response + "request received";
    console.log(tmp);
    res.json({
        test: tmp
    });
});


module.exports = router;
