let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    path_audio: String,
    description: String,
    position: Number,
    type: String,
    paragraphs: [{
        _id: mongoose.Schema.Types.ObjectId,
        position: Number,
        form_type:String,
        filename:String,
        path_name:String,
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