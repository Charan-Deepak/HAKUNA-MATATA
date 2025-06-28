require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
// const bcrypt=require("bcrypt");
// const saltRounds=5;
const app = express();
//const cors=require('cors');

//session cookie passport.js
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
// const LocalStrategy = require('passport-local');

//model
const { Form, Test } = require('./model/adminform');
const { Answer, Test_answer } = require('./model/answerform');
const { User } = require('./model/user');
const { Admin, Test_student} = require('./model/admin');

//route
const adminRoute=require('./routes/admins')
const userRoute=require('./routes/users')
const admin_quizRoute=require('./routes/admin_quiz');
const user_quizRoute = require('./routes/user_quiz');

//Error
const ExpressError = require('./ExpressError');

//ejs ans views
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use("/css",express.static(path.join(__dirname, "node_modules/mdb-ui-kit/css")));
app.use("/js",express.static(path.join(__dirname, "node_modules/mdb-ui-kit/js")));
app.use(bodyParser.json());
app.use(express.json());

// app.use(
//     "/dev",
//     express.static(path.join(__dirname, "node_modules/mdb-ui-kit/dev"))
// );

//Database connection
async function main() {
    await mongoose.connect("mongodb://localhost:27017/Quiz");
}
main()
.then(()=>{console.log("connection successfull");})
.catch((err)=>{console.log(err);})

//session
const sess_Option = {
    secret: "Our little big secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        httpOnly: true,
    }
};
app.use(session(sess_Option));
app.use(flash());
// Make flash messages accessible in all views (optional but recommended)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport for User authentication
passport.use('user', User.createStrategy());

// Configure Passport for Admin authentication
passport.use('admin', Admin.createStrategy());

// Custom serializer
passport.serializeUser((user, done) => {
    const userType = user instanceof Admin ? "admin" : "user";
    done(null, { id: user.id, type: userType });
});

// Custom deserializer
passport.deserializeUser(async (data, done) => {
    try {
        if (data.type === "admin") {
            const admin = await Admin.findById(data.id);
            return done(null, admin);
        } else if (data.type === "user") {
            const user = await User.findById(data.id);
            return done(null, user);
        }
        done(new Error("Invalid user type"));
    } catch (err) {
        done(err);
    }
});


app.get("/",function(req,res){
    res.render("./home/HomePage.ejs");
});

//Route
app.use('/admin',adminRoute);
app.use('/user',userRoute);
app.use('/admin/create_quiz',admin_quizRoute);
app.use('/user/take_quiz', user_quizRoute);

// app.get('/error', ()=>{
//    throw new ExpressError(500,"What");
// })
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured!" } = err;
    res.status(status).render('./error/error.ejs', { status, message });
});


//app.use(cors());//allow incoming requests from ip
app.use('*',(req,res)=>{
    res.render('./error/error.ejs', { status:400, message:"Page not Found!" });
})

app.listen(1000, function() {
    console.log("Server started on port 1000");
});