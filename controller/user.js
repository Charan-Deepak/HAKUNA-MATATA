const { User } = require('../model/user');
const passport = require("passport");
const md5 = require("md5");
const { populate } = require('dotenv');

module.exports.get_login = function (req, res) {
    if (req.isAuthenticated() && req.user.role === 'user') {
        return res.redirect("/user/home");
    } else {
        res.render("./user/login.ejs");
    }}

module.exports.get_register = function (req, res) {
    res.render("./user/register.ejs");
}

module.exports.get_home =async function (req, res) {
    try {
        const user = await User.findOne({ username: req.user.username })
            .populate({
                path: 'test_answer',
                populate: [
                    {
                        path: 'answer_ref',
                        populate: {
                            path: 'form',
                            model: 'Answer'
                        }
                    },
                    {
                        path: 'test_ref',
                        populate: {
                            path: 'form',
                            model: 'Form'
                        }
                    }
                ]
            });
        if (!user) return res.redirect('/user/login');
        res.render("./user/user_home.ejs", { user: JSON.stringify(user) });
    } catch (err) {
        next(err);
    }
}

module.exports.get_overview = async function (req, res) {
    try {
        const user = await User.findOne({ username: req.user.username })
            .populate({
                path: 'test_answer',
                populate: [
                    {
                        path: 'answer_ref',
                        populate: {
                            path: 'form',
                            model: 'Answer'
                        }
                    },
                    {
                        path: 'test_ref',
                        populate: {
                            path: 'form',
                            model: 'Form'
                        }
                    }
                ]
            });
        if (!user) return res.redirect('/user/login');
        res.render("./user/overview.ejs", { user: JSON.stringify(user) });
    } catch (err) {
        next(err);
    }
}

module.exports.get_depth = async function (req, res) {
    try {
        const user = await User.findOne({ username: req.user.username })
            .populate({
                path: 'test_answer',
                populate: [
                    {
                        path: 'answer_ref',
                        populate: {
                            path: 'form',
                            model: 'Answer'
                        }
                    },
                    {
                        path: 'test_ref',
                        populate: {
                            path: 'form',
                            model: 'Form'
                        }
                    }
                ]
            });
        if (!user) return res.redirect('/user/login');
        res.render("./user/depth.ejs", { user: JSON.stringify(user) });
    } catch (err) {
        next(err);
    }
}

module.exports.get_graph = async function (req, res) {
    try {
        const user = await User.findOne({ username: req.user.username })
            .populate({
                path: 'test_answer',
                populate: [
                    {
                        path: 'answer_ref',
                        populate: {
                            path: 'form',
                            model: 'Answer'
                        }
                    }
                ]
            });
        if (!user) return res.redirect('/user/login');
        res.render("./user/graph.ejs", { user: JSON.stringify(user.test_answer) });
    } catch (err) {
        next(err);
    }
}

module.exports.post_register=async function (req, res) {
    const newuser = new User({
        username: req.body.username,
        firstname: req.body.username,
        lastname: req.body.lastname,
        role: 'user',
        emailId: req.body.emailId
    });

    try {
        const user = await User.exists({ username: req.body.username });
        const email = await User.exists({ emailId: req.body.emailId });
        var user_text = "Username already exists";
        var email_text = "This Email ID is already registered";
        var pwd_text = "Passwords do not match. Please verify and re-enter";
        if (user != null) {
            if (email != null) {
                res.render("./user/register.ejs", { unavailable: user_text, accountexists: email_text });
            }
            else {
                res.render("./user/register.ejs", { unavailable: user_text });
            }
        } else {
            if (email != null) {
                res.render("./user/register.ejs", { accountexists: email_text });
            }
            else {
                if (md5(req.body.password) === md5(req.body.repassword)) {
                    User.register(newuser, req.body.password, function (err, user) {
                        if (err) {
                            console.log(err);
                            res.redirect("/user/register");
                        }
                        else {
                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.redirect("/user/login");
                                }
                                res.redirect("/user/home");
                            });
                        }
                    });
                } else {
                    res.render("./user/register.ejs", { mismatch: pwd_text });
                }
            }
        }
    } catch (e) {
        next(e);
    }
}

module.exports.post_login = (req, res) => {
    res.redirect("/user/home");
}

module.exports.get_logout = function (req, res) {
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
}