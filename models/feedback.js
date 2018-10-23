let mongoose = require('mongoose');

let FeedbackSchema = new mongoose.Schema({
    date: Date,
    message: String,
    Session_id: mongoose.Schema.Types.ObjectId

});

mongoose.model('feedback', FeedbackSchema);