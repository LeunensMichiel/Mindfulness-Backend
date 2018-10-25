let mongoose = require("mongoose");

let ExerciseSchema = new mongoose.Schema({
    title: String,
    position: Number,
    session_id: mongoose.Schema.Types.ObjectId
    // position: Number, //No need for position


});

mongoose.model('exercise', ExerciseSchema);