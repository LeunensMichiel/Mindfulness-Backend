let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
        id: String,
        title: String,
        position: Number,
        sessionmap_id: mongoose.Schema.Types.ObjectId,
        // position: Number, //No need for position
        exercises: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'exercise'/*,
            //position: Number, //No need for position
            hexaflex_badges: [Number],
            Pages: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pages'
            }]*/
        }]

});

mongoose.model('session', SessionSchema);