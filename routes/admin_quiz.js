const express = require('express')
const route = express.Router();
const { isAdminLoggedIn }=require('../middleware');
const ControllerAdminQuiz=require('../controller/admin_quiz')

route.get('/',isAdminLoggedIn, ControllerAdminQuiz.get_quiz)

route.post("/quiz_ques",isAdminLoggedIn, ControllerAdminQuiz.post_quizQues);

route.post("/ques_form_new", isAdminLoggedIn, ControllerAdminQuiz.post_ques_form_new);

route.get("/submission_page/:code",isAdminLoggedIn,ControllerAdminQuiz.get_SubmissionPage);

module.exports = route;