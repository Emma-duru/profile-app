const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: {
        type: String,
        required: [true, "Please enter a username"],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "The password should have a minimum of 6 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        lowercase: true,
        unique: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    age: Number,
    bio: String
});

// Get posts
userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "author"
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// Hash password
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
})

// Login function
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect username");
}

module.exports = mongoose.model("User", userSchema);