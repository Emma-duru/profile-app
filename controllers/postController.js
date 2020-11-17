const User = require("../models/User");
const Post = require("../models/Post");

module.exports.posts_get = async(req, res) => {
    const { username } = req.params;
    const loggedUser = res.locals.user;

    try {
        const posts = await User.find({ username })
            .populate({ path: "posts" });
        res.render("posts", { username: username, loggedUser: loggedUser });
    } catch (err) {
        res.json({ err });
    }
}