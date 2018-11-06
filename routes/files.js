let express = require('express');
let router = express.Router();

let con = require("../config/fileDB");

let Image = con.model('image');

router.post('/image', function(req,res, next){
    let img = new Image()
    img.save(function(err, post ){
        if (err) return next(err);
        res.json({message: "nice"})
    });
});

module.exports = router;