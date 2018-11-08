let mongoose = require("mongoose");

let SessionSchema = new mongoose.Schema({
    title: String,
    position: Number,
    sessionmap_id: mongoose.Schema.Types.ObjectId

});

SessionSchema.pre('remove', function(next) {
    this.model('sessionmap').update({},
        {$pull: {sessions: this._id}},
        {safe: true, multi: true},
        next)
});



mongoose.model('session', SessionSchema);