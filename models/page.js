let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    pathAudio: String,
    description: String,
    position: Number,
    exercise_id: mongoose.Schema.Types.ObjectId,
    type: String,
    paragraphs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paragraph'
    }]
});

PageSchema.pre('remove', function (next) {
    this.model('exercise').update({},
        { $pull: { pages: this._id } },
        { safe: true, multi: true },
        next
    );
    this.model('paragraphs').deleteMany(
        { _id: { $in: this.paragraphs } },
        { safe: true, multi: true },
        next
    );
    return next();
});

mongoose.model('page', PageSchema);