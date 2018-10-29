let mongoose = require("mongoose");

let ParagraphSchema = new mongoose.Schema({
    id: String,
    position: Number,
    type:String,
    filename:String,
    pathname:String,
    description:String,
    page_id: mongoose.Schema.Types.ObjectId
});

mongoose.model('paragraph', ParagraphSchema);