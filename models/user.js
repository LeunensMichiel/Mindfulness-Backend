let mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    right: Number,
    current_session: mongoose.Types.ObjectId,
    current_exercise: mongoose.Types.ObjectId,
    Group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groups'
    }
});

mongoose.model('Users', UserSchema);