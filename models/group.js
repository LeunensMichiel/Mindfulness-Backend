let mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
    name: String,
    sessionmap_id: {type: mongoose.Schema.Types.ObjectId,
                ref: 'Sessionmaps'}

});

mongoose.model('group', GroupSchema);