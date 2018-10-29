let mongoose = require("mongoose");

let ParagraphSchema = new mongoose.Schema({
    id: String,
    position: Number,
    type:String,
    filename:String,
    pathname:String,
    description:String,
});

ParagraphSchema.pre('remove', function(next) {
    this.model('page').update({},
        {$pull: {paragraphs: this._id}},
        {safe: true, multi: true},
        next)
});

mongoose.model('paragraph', ParagraphSchema);