const { populate } = require('dotenv');
const { Admin } = require('../model/admin');
const md5 = require("md5");

module.exports.get_login = function (req, res) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return res.redirect("/admin/home");
    } else {
        res.render("./admin/login.ejs");
    }
}

module.exports.get_register = function (req, res) {
    res.render("admin/register.ejs");
}

module.exports.get_home =async function (req, res,next) {
    try {
        const admin = await Admin.findOne({ username: req.user.username }).populate({
            path: 'test',
            populate: {
                path: 'form',
                model: 'Form'
            }
        });;
        if(!admin) return res.redirect('/admin/login');
        res.render("./admin/admin_home.ejs", { admin:JSON.stringify(admin) });
    } catch (err) {
        next(err);
    }
}

module.exports.get_test_overview = async function (req, res, next) {
    try {
        const admin = await Admin.findOne({ username: req.user.username }).populate({
            path: 'test',
            populate: {
                path: 'form',
                model: 'Form'
            }
        });
        if (!admin) return res.redirect('/admin/login');
        res.render("./admin/test_overview.ejs", { admin: JSON.stringify(admin) });
    } catch (err) {
        next(err);
    }
}

module.exports.get_depth= async function (req, res, next) {
    try {
        const admin = await Admin.findOne({ username: req.user.username })
            .populate({
                path: 'test',
                populate: [
                    {
                        path: 'form',
                        model: 'Form'
                    },
                    {
                        path: 'students_attended',
                        populate: [
                            {
                                path: 'student_ref',
                                model: 'User'
                            },
                            {
                                path: 'answer_ref',
                                populate: [
                                    {
                                        path: 'form',
                                        model: 'Answer'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });


        if (!admin) return res.redirect('/admin/login');
        res.render("./admin/depth.ejs", { admin: JSON.stringify(admin) });
    } catch (err) {
        next(err);
    }
}

module.exports.post_register=async function (req, res,next) {

    const newadmin = new Admin({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailId: req.body.emailId,
        role: 'admin',
    });

    try {
        const user = await Admin.exists({ username: req.body.username });//return true or false
        const email = await Admin.exists({ emailId: req.body.emailId });
        var text_user = "Username already exists";
        var text_email = "This Email ID is already registered";
        var text_pwd = "Passwords do not match. Please verify and re-enter";
        if (user != null) {
            if (email != null) {
                res.render("./admin/register.ejs", { unavailable: text_user, accountexists: text_email });
            }
            else {
                res.render("./admin/register.ejs", { unavailable: text_user });
            }
        } else {
            if (email != null) {
                res.render("./admin/register.ejs", { accountexists: text_email });
            }
            else {
                if (md5(req.body.password) === md5(req.body.repassword)) {
                    Admin.register(newadmin, req.body.password, function (err, admin) {
                        if (err) {
                            next(err);
                            res.redirect("/admin/register");
                        }
                        else {
                            req.login(admin, (err) => {
                            if (err) {
                                next(err);
                                return res.redirect("/admin/login");
                            }
                            res.redirect("/admin/home");
                            });
                        }
                    });
                } else {
                    res.render("./admin/register.ejs", { mismatch: text_pwd });
                }
            }
        }
    } catch (e) {
        next(e)
    }
}

module.exports.post_login = (req, res) => {
    res.redirect("/admin/home");
}

module.exports.get_logout = function (req, res,next) {
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
}