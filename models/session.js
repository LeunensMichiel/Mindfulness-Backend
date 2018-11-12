let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
    title: String,
    position: Number,
    sessionmap_id: mongoose.Schema.Types.ObjectId,
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exercise'
    }]
});

SessionSchema.pre('remove', function (next) {
    this.model('exercise').deleteMany(
        { _id: { $in: this.execPopulate } },
        next)
});

mongoose.model('session', SessionSchema);