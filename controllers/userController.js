require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const handleErrors = (err) => {
    const errors = { username: "", email: "", password: "" };

    if (err.code === 11000) {
        const key = Object.values(err.keyPattern);
        if(key.includes("username")) {
            err.username = "This username is already registered";
        }

        if(key.includes("email")) {
            err.email = "This email is already registered";
        }
    }

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    })
    return token;
}


module.exports.home_get = (req, res) => {
    const loggedUser = res.locals.user;
    if (loggedUser) {
        res.redirect(`/${loggedUser.username}/profile`);
    }

    res.render("index");
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
}

module.exports.signup_post = async (req, res) => {
    const {
        first_name,
        last_name,
        username,
        email,
        age,
        bio,
        password
    } = req.body;

    try {
        const user = await User.create({
            first_name,
            last_name,
            username,
            email,
            age,
            bio,
            password
        });
        const token = createToken(user._id);
        res.cookie("user_auth", token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.json({ user });
    } catch (err) {
        const errors = handleToken(err);
        res.json({ errors });
    }

}

module.exports.login_get = (req, res) => {
    res.render("login");
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie("user_auth", token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.json({ user });
    } catch (err) {
        const errors = handleErrors(err);
        console.log(err);
        res.json({ errors });
    }
}

module.exports.profile_get = async (req, res) => {
    const { username } = req.params;
    const loggedUser = res.locals.user;

    try {
        const user = await User.findOne({ username });
        res.render("profile", { user: user, loggedUser: loggedUser });
      
    } catch (err) {
        console.log(err);
    }
    
}


module.exports.profile_edit_get = async (req, res) => {
    const loggedUser = res.locals.user;
    const { username } = req.params;

    if (loggedUser.username === username) {
        try {
            const user = await User.findOne({ username: loggedUser.username });
            res.render("edit", { user: user, loggedUser: loggedUser });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.send("You are not allowed to edit this profile");
    }
    
}


module.exports.profile_edit_post = async (req, res) => {
    const {
        first_name,
        last_name,
        username,
        age,
        email,
        bio,
    } = req.body;

    try {
        const user = await User.findOneAndUpdate({ username: username }, {
            first_name,
            last_name,
            username,
            age,
            email,
            bio, 
        });
        res.json({ user });

    } catch (err) {
        const errors = handleError(err);
        res.json({ errors });
    }
}


module.exports.logout = (req, res) => {
    res.cookie("user_auth", "", {
        maxAge: 1
    })
    res.redirect("/");
}


module.exports.user_list = async (req, res) => {
    const loggedUser = res.locals.user;

    try {
        const users = await User.find({});
        res.render("userList", { users: users, loggedUser: loggedUser });
    } catch(err) {
        console.log(err);
    }
}