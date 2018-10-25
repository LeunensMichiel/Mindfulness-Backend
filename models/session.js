let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
    id: String,
    title: String,
    position: Number,
    sessionmap_id: mongoose.Schema.Types.ObjectId

});

mongoose.model('session', SessionSchema);