let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    pathAudio: String,
    description: String,
    position: Number,
    type: String,
    paragraphs: [{
        // id: mongoose.Schema.Types.ObjectId,
        position: Number,
        form_type:String,
        filename:String,
        pathname:String,
        description:String
    }]
});

PageSchema.pre('remove', function (next) {
    this.model('exercise').updateOne({},
        { $pull: { pages: this._id } },
        { safe: true, multi: true },
        next
    );
    return next();
});

mongoose.model('page', PageSchema);