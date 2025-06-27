const { User } = require('./model/user');
const { Admin } = require('./model/admin');

module.exports.isUserLoggedIn = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') return next();
    res.redirect("/user/login");
};

module.exports.isAdminLoggedIn = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.redirect("/admin/login");
};
  
