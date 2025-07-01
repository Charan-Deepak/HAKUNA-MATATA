const ExpressError = require('../ExpressError');
const { Admin } = require('../model/admin');
const { Form, Test} = require('../model/adminform');
const randomstring = require('randomstring');

module.exports.get_quiz = (req, res) => {
    res.render('./admin/create_quiz.ejs');
}

module.exports.post_quizQues = function (req, res) {
    let quiz_name = req.body.quizName;
    let username = req.user.username;
    res.render("./admin/create_quiz/quiz.ejs", { quiz_name: quiz_name, username: username });
}

module.exports.post_ques_form_new=async function (req, res, next) {
    try {
        let productData = JSON.parse(req.body.productData); //requesting the array
        // Assuming you have a Question model
        let questions = [];

        for (var i = 0; i < productData.length; i++) {
            const form = new Form({
                question_no: productData[i].question_no,
                text: productData[i].text,
                marks: productData[i].marks,
                type: productData[i].type,
                option1: productData[i].option1,
                correct_answer: productData[i].correct_answer,//radio
                option1_answer_checkbox: productData[i].option1_answer_checkbox,
                text_answer: productData[i].text_answer
            });
            await form.save();//save the form
            questions.push(form._id);//push the form into questions
        }

        // Generate a random string of length 6
        var randomString = randomstring.generate(6);
        var random = await Test.exists({ random: randomString });
        while (random != null) {
            randomString = randomstring.generate(6);
            random = await Test.exists({ random: randomString });
        }

        // Assuming you have a Test model with a 'questions' field
        const test = new Test({
            time: req.body.time,
            quiz_name: req.body.quizName,
            random: randomString,
            date:Date.now(),
            form: questions
        });
        await test.save();//save the array of forms that is test
        // Construct the URL on the server-side
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin) {
            await Admin.findOneAndUpdate(
                { username: req.body.username },
                { $push: { test: test._id } }
            );            
        } else {
            // Handle the case where the user does not exist
            return next(new ExpressError(500,'admin not found.'));
        }
        //send object as string to ejs and then parse it
        res.redirect(`/admin/create_quiz/submission_page/${randomString}`);

    } catch (error) {
        next(error);
        // res.status(500).send("Internal Server Error");
    }
}


module.exports.get_SubmissionPage =async function (req, res,next) {
    try {
        let {code}=req.params;
        const test = await Test.findOne({random:code}).populate('form');
        if (!test) {
            return next(new ExpressError(404,"Test not Found!"));
        }
        res.render('./admin/create_quiz/submission_page.ejs', {
            test: JSON.stringify(test),
            user_name: req.user.username,
            quizName: test.quiz_name
        });
    } catch (error) {
        next(error);
        //res.status(500).send("Internal Server Error");
    }
}