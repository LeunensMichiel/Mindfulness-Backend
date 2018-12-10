let mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
    name: String,
    sessionmap_id: {type: mongoose.Schema.Types.ObjectId,
                ref: 'Sessionmaps'}
    ,actief:Boolean,
    aanmaakdatum:Date,
    notifications:[{
        notification_title:String,
        notification_beschrijving:String,
        notification_launchtijdstip:Date
    }]
}); 

mongoose.model('group', GroupSchema);