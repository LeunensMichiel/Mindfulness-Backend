let mongoose = require('mongoose');

let SessionmapSchema = new mongoose.Schema({
    titleCourse: String,
    session: [{
        id: String,
        title: String,
        // position: Number, //No need for position
        exercises: [{
            id: String,
            title: String/*,
            //position: Number, //No need for position
            hexaflex_badges: [Number],
            Pages: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pages'
            }]*/
        }]
    }]

});



mongoose.model('sessionmap', SessionmapSchema);