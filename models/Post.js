const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title for your post"]
    },
    body: {
        type: String,
        required: [true, "Please enter the body for your post"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

postSchema.virtual("date-formatted").get(function(){
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("Post", postSchema);