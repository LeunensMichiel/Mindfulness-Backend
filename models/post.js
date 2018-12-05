let mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
    sessionmap_id:mongoose.Schema.Types.ObjectId,
    session_id:mongoose.Schema.Types.ObjectId,
    exercise_id:mongoose.Schema.Types.ObjectId,
    page_id:mongoose.Schema.Types.ObjectId,
    inhoud:String,
    afbeelding:String, // voorlopig als string
    user_id: mongoose.Schema.Types.ObjectId,
    image_file_name:String,
    session_name:String,
    exercise_name:String,
    page_name:String
});

mongoose.model('post', PostSchema);