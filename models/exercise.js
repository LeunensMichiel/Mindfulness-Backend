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
    this.model('page').deleteMany(
        {_id: { $in: this.pages }},
        next
    );

    this.model('session').updateMany({},
        { $pull: { exercises: this._id } },
        next
    );
    return next();
});


mongoose.model('exercise', ExerciseSchema);