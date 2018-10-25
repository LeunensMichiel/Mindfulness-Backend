let mongoose = require('mongoose');

let SessionmapSchema = new mongoose.Schema({
    titleCourse: String

});



mongoose.model('sessionmap', SessionmapSchema);