let mongoose = require('mongoose');

let FeedbackSchema = new mongoose.Schema({
    date: Date,
    message: String,
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'session'
    }

});

mongoose.model('feedback', FeedbackSchema);