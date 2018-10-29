let mongoose = require("mongoose");

let ParagraphSchema = new mongoose.Schema({
    id: String,
    position: Number,
    type:String,
    filename:String,
    pathname:String,
    description:String,
});

mongoose.model('paragraph', ParagraphSchema);