let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    pathAudio: String,
    description: String,
    position: Number,
    // exercise_id: mongoose.Schema.Types.ObjectId,
    type: String,
    paragraphs: [{
        id: mongoose.Schema.Types.ObjectId,
        position: Number,
        formType:String,
        filename:String,
        pathname:String,
        description:String
    }]
});

PageSchema.pre('remove', function (next) {
    this.model('exercise').update({},
        { $pull: { pages: this._id } },
        { safe: true, multi: true },
        next
    );
    return next();
});

mongoose.model('page', PageSchema);