let mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
    sessionmap_id: mongoose.Schema.Types.ObjectId,
    session_id: mongoose.Schema.Types.ObjectId,
    exercise_id: mongoose.Schema.Types.ObjectId,
    page_id: mongoose.Schema.Types.ObjectId,
    inhoud: String,
    afbeelding: String, // voorlopig als string
    user_id: mongoose.Schema.Types.ObjectId,
    image_file_name:String,
    session_name:String,
    exercise_name:String,
    page_name:String,
    multiple_choice_items: [{
        position: Number,
        message: String,
        checked: {
            type:Boolean,
            default: false
        }
    }],
    date: { type: Date, default: Date.now }
});

/**
 * create index'en
 */

PostSchema.index({sessionmap_id: 1, session_id: 1, exercise_id: 1, page_id: 1, user_id: 1});

PostSchema.index({page_id: 1});

// PostSchema.set('autoIndex', false);

mongoose.model('post', PostSchema);