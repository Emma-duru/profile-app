const User = require("../models/User");
const Post = require("../models/Post");

module.exports.posts_get = async(req, res) => {
    const { username } = req.params;
    const loggedUser = res.locals.user;

    try {
        const user = await User.findOne({ username });
        const posts = await Post.find({ author: user._id }).populate("author");
        res.render("posts", { username: username, loggedUser: loggedUser, posts: posts });
    } catch (err) {
        res.json({ err });
    }
}

module.exports.post_create_get = (req, res) => {
    const loggedUser = res.locals.user;
    const { username } = req.params;

    if (loggedUser.username === username) {
        res.render("addPost", { loggedUser: loggedUser })
    } else {
        res.send("You are not allowed to access this route");
    }
    
}

module.exports.post_create_post = async (req, res) => {
    const loggedUser = res.locals.user;
    const { title, body } = req.body;

    if (loggedUser.username === username) {
        try {
            const user = await User.findOne({ username: loggedUser.username });
            const post = await Post.create({ title: title, body: body, author: user._id });
            res.json({ post });
        } catch (err){
            console.log(err);
        }
    }
}

module.exports.all_posts = async(req, res) => {
    const loggedUser = res.locals.user;

    try {
        const posts = await Post.find({}).populate("author");
        res.render("allPosts", { loggedUser: loggedUser, posts: posts });
    } catch (err) {
        console.log(err);
    }
}
module.exports.post_detail = async(req, res) => {
    const loggedUser = res.locals.user;
    const { slug } = req.params;

    try {
        const post = await Post.findOne({ slug }).populate("author");
        res.render("postDetail", { loggedUser: loggedUser, post: post });
    } catch (err) {
        console.log(err);
    }
}

module.exports.post_edit_get = async(req, res) => {
    const loggedUser = res.locals.user;
    const { username, slug } = req.params;

    if (loggedUser.username === username) {
        try {
            const post = await (await Post.findOne({ slug })).populate("author");
            res.render("postEdit", { loggedUser: loggedUser, post: post });
        } catch(err) {
            console.log(err);
        }
    } else {
        res.send("You are not allowed to access this route");
    }

}

module.exports.post_edit_post = async(req, res) => {
    const { title, body } = req.body;
    const loggedUser = res.locals.user;
    const { username } = req.params;

    if (loggedUser.username === username) {
        try {
            const post = await Post.findOneAndUpdate({ title }, { title, body});
            res.json({ post });
        } catch(err){
            console.log(err);
        }
    } else {
        res.send("You are not allowed to access this route");
    }
}

module.exports.post_delete = async(req, res) => {
    const { slug } = req.params;
    const { username } = res.locals.user;

    if (loggedUser.username === username) {
        try {
            await Post.findOneAndDelete({ slug });
            res.redirect(`/${username}/posts`);
        } catch(err) {
            console.log(err);
        }
    } else {
        res.send("You are not allowed to access this route");
    }
}