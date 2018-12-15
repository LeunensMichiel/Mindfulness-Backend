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

/**
 * create Index'en
 */

PageSchema.index({_id: 1, "paragraphs.position": 1});

// PageSchema.set('autoIndex', false);

/**
 * Cascade remove
 */

PageSchema.pre('remove', function (next) {
    this.model('exercise').updateMany({},
        { $pull: { pages: this._id } },
        next
    );
    return next();
});


mongoose.model('page', PageSchema);