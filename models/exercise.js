let mongoose = require("mongoose");

let ExerciseSchema = new mongoose.Schema({
    title: String,
    position: Number,
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page'
    }]
});

ExerciseSchema.pre('remove' ,function(next){
    console.log("PRE-REMOVE");
    console.log(this.pages);
    this.model('page').deleteMany(
        {_id: { $in: this.pages }},
        next
    ); 
});

mongoose.model('exercise', ExerciseSchema);