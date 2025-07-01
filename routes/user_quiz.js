const express = require('express');
const route = express.Router();
const { isUserLoggedIn }=require('../middleware');
const ControllerUserQuiz=require('../controller/user_quiz');
//ok
route.get("/take_quiz", isUserLoggedIn, ControllerUserQuiz.get_takequiz);

route.post("/ques_paper", isUserLoggedIn,ControllerUserQuiz.post_quesPaper);

route.post("/marks_page", isUserLoggedIn, ControllerUserQuiz.post_markPage);

route.get("/marks_page/:code", isUserLoggedIn , ControllerUserQuiz.get_markPage);

module.exports = route;