let con = require('../config/fileDB')
let Schema = require('mongoose').Schema

let imageSchema = new Schema({
    createdAt:{
        type: Date,
        required: true,
        default: new Date()
    }
})

con.model('image', imageSchema);