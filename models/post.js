let mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
    sessionmap_id:mongoose.Schema.Types.ObjectId,
    session_id:mongoose.Schema.Types.ObjectId,
    exercise_id:mongoose.Schema.Types.ObjectId,
    page_id:mongoose.Schema.Types.ObjectId,
    inhoud:String,
    afbeelding:String, // voorlopig als string
    user_id: mongoose.Schema.Types.ObjectId
});

mongoose.model('post', PostSchema);