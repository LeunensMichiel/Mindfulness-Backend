var express = require('express');
var connection = require('../config/database');
var router = express.Router();

router.get('/API/mindfulness', function(req, res, next) {
  connection.query("SELECT * FROM TextPage", function (error, results, fields){
    res.json(results);
  })
});

module.exports = router;
