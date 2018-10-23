let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    exercise_id: mongoose.Schema.Types.ObjectId,
    pathAudio: String,
    description: String,
    Type: String,
    paragraph: [{
        id: mongoose.Schema.Types.ObjectId,
        Type: String,
        position: Number,
        content: String
    }]

});

mongoose.model('page', PageSchema);