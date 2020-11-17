const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const slugify = require("slugify");

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
    slug: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

postSchema.virtual("date_formatted").get(function(){
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

postSchema.pre("validate", function(){
    this.slug = slugify(this.title + this.date, {
        strict: true,
        lowercase: true
    });
})

module.exports = mongoose.model("Post", postSchema);