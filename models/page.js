let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    pathAudio: String,
    description: String,
    position: Number,
    type: String
    // paragraph: [{
    //     id: mongoose.Schema.Types.ObjectId,
    //     Type: String,
    //     position: Number,
    //     content: String
    // }]

});

mongoose.model('page', PageSchema);