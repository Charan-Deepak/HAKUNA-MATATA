const { User } = require('./model/user');
const { Admin } = require('./model/admin');
const { Test } = require('./model/adminform');

module.exports.isUserLoggedIn = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') return next();
    res.redirect("/user/login");
};

module.exports.isAdminLoggedIn = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.redirect("/admin/login");
};
  
// module.exports.isTestSubmitted = async (req, res, next) => {
//     try {
//         const user = await User.findOne({ username: req.user.username });
//         if (!user) {
//             // Optional: Handle unauthenticated or missing user
//             return res.redirect("/user/login");
//         }

//         const existingAnswer = user.test_answer.find(ans => ans.quiz_code === req.body.quizcode);
//         if (!existingAnswer) return next();

//         const notSubmitted = typeof existingAnswer.answer_ref === "undefined";
//         if (notSubmitted) return next();

//         // Already submitted, render with warning code
//         return res.render("./user/take_quiz/take_quiz.ejs", { code: 1 });

//     } catch (err) {
//         next(err);
//     }
// };
