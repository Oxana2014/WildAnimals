const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Animal = require("./animal")

const ImageSchema = new Schema({
    url: String,
    filename: String ,
    vertical: {
        type: Boolean,
        default: false
    }  
});
ImageSchema.virtual('thumbnail').get(function() {
return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});
ImageSchema.virtual('foredit').get(function() {
    return this.url.replace('/upload', '/upload/h_200,c_fill');
    });
ImageSchema.virtual('toHorizontal').get(function() {
    return this.url.replace('/upload', '/upload/w_700,h_500,c_pad,b_white')
    });

const opts = {toJSON: {virtuals: true}};

const AdditionSchema = new Schema({
    animal: {
        type: Schema.Types.ObjectId,
        ref: "Animal"
    },
    moderate: {
        type: String,
        enum: ["new", "ready" ],
        default: "new"
    },
    body: String,
    images: [ImageSchema],
    source: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts);

module.exports = mongoose.model("Addition", AdditionSchema);