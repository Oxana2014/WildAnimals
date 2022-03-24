const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    created: { 
        type: Date,
         default: Date.now 
        },
    body: String,
});

module.exports = mongoose.model("News", NewsSchema);