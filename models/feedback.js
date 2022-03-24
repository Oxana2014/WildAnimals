const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    username: String,
    body: String,
    // address: String,
    moderate: {
        type: String,
        enum: ["new", "useful", "old"],
        default: "new"
    },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);