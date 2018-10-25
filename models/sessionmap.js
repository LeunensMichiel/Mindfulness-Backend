let mongoose = require('mongoose');

let SessionmapSchema = new mongoose.Schema({
    titleCourse: String,
    // sessions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'session'
    // }]

});



mongoose.model('sessionmap', SessionmapSchema);