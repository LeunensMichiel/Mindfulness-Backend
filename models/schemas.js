var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    mindfullness:{
        user:new Schema({
            email:({type:String})
        })
    },

    files:{
        image:new Schema({
            created:{
                type:Date,
                required:true,
                default:new Date()
            }
        })
    }
};