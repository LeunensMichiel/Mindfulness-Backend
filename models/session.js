let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
        id: String,
        title: String,
        position: Number,
        sessionmap_id: mongoose.Schema.Types.ObjectId
        // position: Number, //No need for position


});

mongoose.model('session', SessionSchema);