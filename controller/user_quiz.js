const { User } = require('../model/user');
const { Admin } = require('../model/admin');
const { Test } = require('../model/adminform');
const { Test_answer, Answer } = require('../model/answerform');
const ExpressError = require('../ExpressError');

module.exports.get_takequiz = function (req, res) {
    res.render("./user/take_quiz/take_quiz.ejs", { code: 0, message: "You Already Responded!" });
}

module.exports.post_quesPaper=async function (req, res) {
    const test = await Test.findOne({ random: req.body.quizcode }).populate('form');
    if (!test) {
        // code: 2 => Quiz code not found
        return res.render("./user/take_quiz/take_quiz.ejs", { code: 2 });
    }

    const student_exists = test.students_attended.some(
        s => s.username === req.user.username
    );

    if (!student_exists) {
        // Show quiz questions;
        res.render("./user/take_quiz/ques_paper.ejs", {
            quiz_code: req.body.quizcode,
            test: JSON.stringify(test)
        });
    } else {
        // code: 1 => Already attempted
        res.render("./user/take_quiz/take_quiz.ejs", { code: 1 });
    }
}

module.exports.post_markPage = async function (req, res, next) {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) return res.redirect('/user/login');

        const answerData = JSON.parse(req.body.answerData);
        let questions = [];

        for (let i = 0; i < answerData.length - 2; i++) {
            const answer = new Answer({
                mark: answerData[i].mark,
                type: answerData[i].type,
                correct_answer: answerData[i].correct_answer,
                option1_answer_checkbox: answerData[i].option1_answer_checkbox,
                text_answer: answerData[i].text_answer
            });

            await answer.save();
            questions.push(answer._id);
        }

        const test_answer = new Test_answer({
            totalmarks: answerData[answerData.length - 2],
            totalmarksget: answerData[answerData.length - 1],
            quiz_code: req.body.quiz_code,
            form: questions
        });

        await test_answer.save();

        user.test_answer.push({
            answer_ref: test_answer._id,
            quiz_code: req.body.quiz_code,
            date: Date.now()
        });
        await user.save();

        const test = await Test.findOne({ random: req.body.quiz_code });
        if (!test) return next(new ExpressError(404,"Test not found."));

        test.students_attended.push({
            student_ref: user._id,
            username: req.user.username,
            marks: test_answer.totalmarksget
        });
        await test.save();
        res.redirect(`/user/take_quiz/marks_page/${req.body.quiz_code}`);
    } catch (error) {
        next(error);
        //res.status(500).send("Internal Server Error");
    }
}


module.exports.get_markPage =async function (req, res,next) {
    try {
        let { code } = req.params;
        const test = await Test.findOne({ random: code }).populate('form');
        const user = await User.findOne({ username:req.user.username,"test_answer.quiz_code": code })
            .populate({
                path: 'test_answer.answer_ref',
                populate: {
                    path: 'form', // inside Test_answer, populate its form
                    model: 'Answer'
                }
            });
        if (!test||!user) {
            return next(new ExpressError(500,"Test or User not Found!"));
        }
        const testAnsEntry = user.test_answer.find(
            t => t.quiz_code === code && t.answer_ref
        );
        if (!testAnsEntry) {
            return next(new ExpressError(500, "Answers Not Found!"));
        }
        res.render("./user/take_quiz/marks_page.ejs", {
            message: JSON.stringify(testAnsEntry.answer_ref),
            user_name: req.user.username,
            test: JSON.stringify(test)
        });
    } catch (error) {
        next(error)
        //res.status(500).send("Internal Server Error");
    }
}
