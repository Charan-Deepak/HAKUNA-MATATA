require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose=require('mongoose');
const md5=require("md5");
// const bcrypt=require("bcrypt");
// const saltRounds=5;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const LocalStrategy = require('passport-local').Strategy;
//const cors=require('cors');
const randomstring = require('randomstring');


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/mdb-ui-kit/css"))
);


app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/mdb-ui-kit/js"))
);

// app.use(
//     "/dev",
//     express.static(path.join(__dirname, "node_modules/mdb-ui-kit/dev"))
// );


mongoose.connect("mongodb://localhost:27017/Quiz");


app.use(session({
    secret: "Our little big secet",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const formSchema=new mongoose.Schema({ //schema for form that get for sumbit option in admin quetion
    question_no:Number,
    text:String,
    marks:Number,
    type:Number,
    option1:[ 'String' ],//for array of options],
    option1_answer_checkbox:['Number'],//for array of numbers
    correct_answer:Number,
    text_answer:String
});

const testSchema=new mongoose.Schema({
    quiz_name:String,
    random:String,
    form:[formSchema] //array forms
});

const Test = new mongoose.model("Test",testSchema);//model
const Form=new mongoose.model("Form",formSchema);//model

const adminSchema=new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    emailId:
    {type:String,
     lowercase:true     
    },
    password:String,
    repassword:String,
    test:[testSchema]
});

const userSchema=new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    emailId:
    {type:String,
     lowercase:true     
    },
    password:String,
    repassword:String
});


adminSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

const Admin = new mongoose.model("Admin",adminSchema);
const User = new mongoose.model("User",userSchema);


// Configure Passport for User authentication
passport.use('user', User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure Passport for Admin authentication
passport.use('admin', Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.get("/",function(req,res){
    res.render("HomePage.ejs");
});

app.get("/admin-login",function(req,res){
   res.render("admin-login.ejs");
});



app.get("/user-login",function(req,res){
    res.render("user-login.ejs");
});

app.get("/features",function(req,res){
    res.render("features.ejs")
});

app.get("/register-admin",function(req,res){
    res.render("register-admin.ejs");
});

app.get("/register-user",function(req,res){
    res.render("register-user.ejs");
});


app.get("/admin",function(req,res){
    if(req.isAuthenticated){
        const user_name =req.query.user_name;
        console.log(user_name);
        res.render("admin",{user_name:user_name});
    }
    else{
        req.redirect("/admin-login");
    }
});


app.post("/register-admin", async function(req,res){

       const newadmin = new Admin({
        username:req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        emailId:req.body.emailId,
        test:[]
    });
 

    try{
        const user=await Admin.exists({username:req.body.username});
        const email=await Admin.exists({emailId:req.body.emailId});
        if(user!=null)
       { 
        var text="Username  already exists";
        var text2="You already registered.emailId already exists ";
        if(email!=null)
       {
        res.render("register-admin",{unavailable:text,accountexists:text2});
       }
       else{
            res.render("register-admin",{unavailable:text});
        }
    }else{
        if(email!=null)
        {
            var text2="You already registered.emailId already exists";
            res.render("register-admin",{accountexists:text2}); }
       else{
            if(md5(req.body.password)===md5(req.body.repassword))
            { 
                Admin.register(newadmin,req.body.password,function(err,admin){
                    if(err){
                        console.log(err);
                        res.redirect("/register-admin");
                    }
                    else{
                        res.redirect("/admin-login");            
                    }
                });
            }else{
            var text="Password mismatch. Please verify and re-enter.";
            res.render("register-admin",{mismatch:text}); 
        }}
    }
    }catch(e){
        console.log(e.message)
    }         
    });


 app.post("/admin-login",function(req,res){

        const admin = new Admin({
            username: req.body.username,
            password: req.body.password
        });
        req.login(admin,function(err){
            if(err){
                console.log(err);
            }
            else{
                passport.authenticate("admin")(req,res,function(){
                    res.render("admin.ejs",{user_name:req.body.username});
                })
            }
        })

        app.get("/")

 });


 app.get("/user",function(req,res){
    if(req.isAuthenticated){
        res.render("user");
    }
    else{
        req.redirect("/user-login");
    }
});

 app.post("/register-user",async function(req,res){
        const newuser = new User({
            username:req.body.username,
            firstname:req.body.username,
            lastname:req.body.lastname,
            emailId:req.body.emailId
       });
       
       try{
        const user=await User.exists({username:req.body.username});
        const email=await User.exists({emailId:req.body.emailId});
        if(user!=null)
       { 
        var text="Username  already exists";
        var text2="You already registered.emailId already exists ";
        if(email!=null)
       {
        res.render("register-user",{unavailable:text,accountexists:text2});
       }
       else{
            res.render("register-user",{unavailable:text});
        }
    }else{
        if(email!=null)
        {
            var text2="You already registered.emailId already exists";
            res.render("register-user",{accountexists:text2}); }
       else{
            if(md5(req.body.password)===md5(req.body.repassword))
            { 
                User.register(newuser,req.body.password,function(err,user){
                    if(err){
                        console.log(err);
                        res.redirect("/register-user");
                    }
                    else{
                        res.redirect("/user-login");            
                    }
                });
            }else{
            var text="Password mismatch. Please verify and re-enter.";
            res.render("register-user",{mismatch:text}); 
        }}
    }
    }catch(e){
        console.log(e.message)
    }


});

app.get("/submittionpage",function(req,res){
    res.render("submittionpage.ejs")
});

 app.post("/user-login",function(req,res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("user")(req,res,function(){
                res.redirect("/user");
            })
        }
    })
});

let posts = [];

app.post("/create-quiz",function(req,res){
    let quiz_name=req.body.quizName;
    let username=req.body.username;
    res.render("admin_question_new",{quiz_name:quiz_name,username:username});
   
});

app.post("/add-ques", function(req,res){
    const post = {
      ques : req.body.question,
      ans : req.body.answer,
      marks : req.body.mark
    };
    posts.push(post);
   
  });
  app.use(bodyParser.json());
  app.use(express.json());
  //app.use(cors());//allow incoming requests from ip
  app.post("/admin_question_new", async function(req, res,next) {
    
    console.log("first")
     console.log("second")

        try {
            
          let productData=req.body.productData; //requesting the array
            console.log(productData)//print the array in console
            // Assuming you have a Question model
            let questions = [];
           
           
            for (var i=0;i<productData.length;i++) {
                const form = new Form({
                    question_no: productData[i].question_no,
                    text: productData[i].text,
                    marks:productData[i].marks,
                    type: productData[i].type,
                    option1: productData[i].option1 ,
                    correct_answer: productData[i].correct_answer,//radio
                    option1_answer_checkbox:productData[i].option1_answer_checkbox,
                    text_answer: productData[i].text_answer
                });
             console.log(1);

              await form.save();//save the form
              //  questions.push(question);
              console.log(2);
                questions.push(form);//push the form into questions
            }
            
            console.log(3);
            // Generate a random string of length 6
            var randomString = randomstring.generate(6);
            var random=await Test.exists({random:randomString});
            while(random!=null){
                 randomString = randomstring.generate(6);
                 random=await Test.exists({random:randomString});
            }
    
            // Assuming you have a Test model with a 'questions' field
            const test = new Test({
                quiz_name:req.body.quizName,
                random:randomString,
               form: questions
            });
    
            console.log(4);
           await test.save();//save the array of forms that is test
            console.log(5);
            // Construct the URL on the server-side
            const user = await Admin.findOne({ username: req.body.username });

            if (user) {
                // If the user exists, update the test array for that user
                user.test.push(test); // Assuming newTestObject is the object you want to push to the test array
                // You can also use user.test = [...user.test, newTestObject]; if you want to create a new array instead of mutating the existing one

                // Save the updated user data back to the database
                await user.save();
            } else {
                // Handle the case where the user does not exist
                console.log('User not found.');
            }

         const filename ="/submittionpage"; // Name of the file in the same folder
       const url = `${req.protocol}://${req.get('host')}${filename}`;
       res.json({ url,test });
           //res.json(test)

    
        } catch (error) {  
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    


app.listen(1000, function() {
    console.log("Server started on port 1000");
  });
  