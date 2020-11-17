const User = require("../models/User");
const Post = require("../models/Post");

module.exports.posts_get = async(req, res) => {
    const { username } = req.params;
    const loggedUser = res.locals.user;

    try {
        const user = await User.findOne({ username });
        const posts = await Post.find({ author: user._id });
        console.log(posts);
        res.render("posts", { username: username, loggedUser: loggedUser, posts: posts });
    } catch (err) {
        res.json({ err });
    }
}

module.exports.post_create_get = (req, res) => {
    const loggedUser = res.locals.user;

    res.render("addPost", { loggedUser: loggedUser })
}

module.exports.post_create_post = async (req, res) => {
    const loggedUser = res.locals.user;
    const { title, body } = req.body;

    try {
        const user = await User.findOne({ username: loggedUser.username });
        const post = await Post.create({ title: title, body: body, author: user._id });
        res.json({ post });
    } catch (err){
        console.log(err);
    }
}