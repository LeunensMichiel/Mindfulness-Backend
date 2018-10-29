let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    pathAudio: String,
    description: String,
    position: Number,
    exercise_id: mongoose.Schema.Types.ObjectId,
    type: String,
    paragraphs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paragraphs'
    }]
});



mongoose.model('page', PageSchema);