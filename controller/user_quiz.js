const { User } = require('../model/user');
const { Admin } = require('../model/admin');
const { Test } = require('../model/adminform');
const { Test_answer, Answer } = require('../model/answerform');
const ExpressError = require('../ExpressError');

module.exports.get_takequiz = function (req, res) {
    res.render("./user/take_quiz/take_quiz.ejs", { code: 0});
}

module.exports.post_quesPaper = async function (req, res) {
    const test = await Test.findOne({ random: req.body.quizcode }).populate('form');
    const user = await User.findOne({ username: req.user.username });

    // If quiz code not found
    if (!test) {
        return res.render("./user/take_quiz/take_quiz.ejs", { code: 2 });
    }

    const now = new Date();
    const existingAnswer = user.test_answer.find(ans => ans.quiz_code === req.body.quizcode);

    // If user hasn't attempted the quiz yet
    if (!existingAnswer) {
        const endTime = new Date(now.getTime() + test.time * 60 * 1000); // Set end time

        test.students_attended.push({
            student_ref: user._id,
            username: req.user.username,
            marks: 0
        });

        await test.save();
        user.test_answer.push({
            quiz_code: req.body.quizcode,
            end_date: endTime,
        });

        await user.save(); // Save the updated user record

        return res.render("./user/take_quiz/ques_paper.ejs", {
            quiz_code: req.body.quizcode,
            test: JSON.stringify(test),
            end_time: endTime
        });
    }

    // User already has a test_answer entry
    const expiredOrNoTimer = test.time === 0 || (existingAnswer.end_date && (existingAnswer.end_date - now)>=0);
    const notSubmitted = typeof existingAnswer.answer_ref === "undefined";

    if (notSubmitted && expiredOrNoTimer) {
        // Allow to show quiz paper again
        return res.render("./user/take_quiz/ques_paper.ejs", {
            quiz_code: req.body.quizcode,
            test: JSON.stringify(test),
            end_time: existingAnswer.end_date
        });
    }

    // Already attempted and active
    return res.render("./user/take_quiz/take_quiz.ejs", { code: 1 });
};


module.exports.post_markPage = async function (req, res, next) {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) return res.redirect('/user/login');

        let answerData;
        try {
            answerData = JSON.parse(req.body.answerData);
        } catch (e) {
            return next(new ExpressError("Invalid answer data."));
        }

        if (answerData.length < 2) {
            return next(new ExpressError("Incomplete answer data."));
        }

        const totalmarks = answerData[answerData.length - 2];
        const totalmarksget = answerData[answerData.length - 1];
        const answersOnly = answerData.slice(0, -2);

        const answerIds = [];

        for (let ans of answersOnly) {
            const answer = new Answer({
                mark: ans.mark,
                type: ans.type,
                correct_answer: ans.correct_answer,
                option1_answer_checkbox: ans.option1_answer_checkbox,
                text_answer: ans.text_answer
            });

            await answer.save();
            answerIds.push(answer._id);
        }

        const test_answer = new Test_answer({
            totalmarks,
            totalmarksget,
            quiz_code: req.body.quiz_code,
            form: answerIds
        });

        await test_answer.save();


        const test = await Test.findOne({ random: req.body.quiz_code });
        if (!test) return next(new ExpressError("Test not found."));

        let userAnswerEntry = user.test_answer.find(ans => ans.quiz_code === req.body.quiz_code);
        if (userAnswerEntry) {
            userAnswerEntry.answer_ref = test_answer._id;
            userAnswerEntry.test_ref=test._id;
        } else {
            user.test_answer.push({
                quiz_code: req.body.quiz_code,
                answer_ref: test_answer._id,
                end_date: new Date(),
                test_ref:test._id
            });
        }
        await user.save();

        const index = test.students_attended.findIndex(
            s => s.student_ref.toString() === user._id.toString()
        );

        if (index !== -1) {
            // Update the existing entry
            test.students_attended[index].answer_ref = test_answer._id;
            test.students_attended[index].marks = totalmarksget;
        } else {
            // Push a new entry if it doesn't exist
            test.students_attended.push({
                student_ref: user._id,
                username: req.user.username,
                marks: totalmarksget,
                answer_ref: test_answer._id,
            });
        }

        await test.save();        

        res.redirect(`/user/take_quiz/marks_page/${req.body.quiz_code}`);
    } catch (error) {
        next(error);
    }
};
  
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
