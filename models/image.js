let con1 = require('../config/fileDB')
let Schema = require('mongoose').Schema
let imageSchema = new Schema({
    createdAt:{
        type: Date,
        required: true,
        default: new Date()
    }
})

con1.model('image', imageSchema);