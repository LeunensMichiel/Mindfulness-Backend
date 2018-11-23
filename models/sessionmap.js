let mongoose = require('mongoose');

let SessionmapSchema = new mongoose.Schema({
    titleCourse: String,
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'session'
    }]

});

SessionmapSchema.pre('remove', function (next) {
    this.model('session').deleteMany(
        { _id: { $in: this.sessions } },
        next)
});

mongoose.model('sessionmap', SessionmapSchema);