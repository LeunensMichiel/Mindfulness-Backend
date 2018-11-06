var mongoose = require('mongoose')
var con = mongoose.createConnection('mongodb://localhost/filesDB');
module.exports = exports = con ;