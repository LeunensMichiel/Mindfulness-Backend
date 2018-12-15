let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
    title: String,
    position: Number,
    image_filename: String,
    description: String,
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exercise'
    }]
});

SessionSchema.pre('remove', function (next) {
    console.log(this.exercises);

    this.model('exercise').deleteMany(
        {_id: { $in: this.exercises }},
        next
    );

    this.model('sessionmap').updateMany({},
        { $pull: { sessions: this._id } },
        next
    );
    return next();
});

mongoose.model('session', SessionSchema);