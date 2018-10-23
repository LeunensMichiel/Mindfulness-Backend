let mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
    name: String,
    sessionmap: {type: mongoose.Schema.Types.ObjectId,
                ref: 'Sessionmaps'}

});

mongoose.model('Groups', GroupSchema);