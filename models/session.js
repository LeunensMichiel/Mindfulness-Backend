let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
    title: String,
    position: Number,
    image_name: String,
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exercise'
    }]
});

SessionSchema.pre('remove', function (next) {
    // this.model('exercise').deleteMany(
    //     { _id: { $in: this.execPopulate } },
    //     next)

    this.model('sessionmap').update({},
        { $pull: { sessions: this._id } },
        { safe: true, multi: true },
        next
    );
    return next();
});

mongoose.model('session', SessionSchema);