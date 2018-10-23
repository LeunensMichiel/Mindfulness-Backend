let mongoose = require('mongoose');

let SessionmapSchema = new mongoose.Schema({
    titleCourse: String,
    sessions: [{
        id: Schema.Types.ObjectId,
        title: String,
        // position: Number, //No need for position
        exercises: [{
            id: Schema.Types.ObjectId,
            title: String,
            //position: Number, //No need for position
            hexaflex_badges: [Number],
            Pages: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pages'
            }]
        }]
    }]

});



mongoose.model('Sessionmaps', SessionmapSchema);