var mongoose = require('mongoose')
var con = mongoose.createConnection('mongodb://projecten3studserver03.westeurope.cloudapp.azure.com/filesdb', { useNewUrlParser: true });
module.exports = exports = con;