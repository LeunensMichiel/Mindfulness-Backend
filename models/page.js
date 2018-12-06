let mongoose = require('mongoose');

let PageSchema = new mongoose.Schema({
    title: String,
    audio_filename: String,
    description: String,
    position: Number,
    type: String,
    paragraphs: [{
        position: Number,
        form_type:String,
        image_filename:String,
        description:String
    }],
    type_input: String,
    multiple_choice_items: [{
        position: Number,
        message: String
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