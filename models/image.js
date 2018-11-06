let filedb = require('../config/multi-con')
let mongoose = require('mongoose')

let imageSchema = new mongoose.Schema({
    createdAt:{
        type: Date,
        required: true,
        default: new Date()
    }
})

filedb.fileCon.model('image', imageSchema);