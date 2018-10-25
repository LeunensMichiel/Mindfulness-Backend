let mongoose = require("mongoose");

let ExerciseSchema = new mongoose.Schema({
    title: String,
    position: Number,
    session_id: mongoose.Schema.Types.ObjectId,
    // position: Number, //No need for position
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page'/*,
            //position: Number, //No need for position
            hexaflex_badges: [Number],
            Pages: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pages'
            }]*/
    }]

});

mongoose.model('exercise', ExerciseSchema);