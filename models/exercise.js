let mongoose = require("mongoose");

let ExerciseSchema = new mongoose.Schema({
    title: String,
    position: Number,
    session_id: mongoose.Schema.Types.ObjectId,
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page'
    }]
});

ExerciseSchema.post('remove' ,function(next){
    console.log("PRE-REMOVE");
    console.log(this.pages);
    this.model('page').deleteMany(
        {_id: { $in: this.pages }},
        next
    );
});

mongoose.model('exercise', ExerciseSchema);