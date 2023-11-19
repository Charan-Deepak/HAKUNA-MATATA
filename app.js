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


const adminSchema=new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    emailId:String,
    password:String,
    repassword:String
});

const userSchema=new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    emailId:String,
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



// passport.serializeUser(function (entity, done) {
//     done(null, { id: entity.id, type: entity.type });
// });


// passport.deserializeUser(function (obj, done) {
//     switch (obj.type) {
//         case 'user':
//             User.findById(obj.id)
//                 .then(user => {
//                     if (user) {
//                         done(null, user);
//                     }
//                     else {
//                         done(new Error('user id not found:' + obj.id, null));
//                     }
//                 });
//             break;
//         case 'admin':
//             Admin.findById(obj.id)
//                 .then(device => {
//                     if (device) {
//                         done(null, device);
//                     } else {
//                         done(new Error('device id not found:' + obj.id, null));
//                     }
//                 });
//             break;
//         default:
//             done(new Error('no entity type:', obj.type), null);
//             break;
//     }
// });

// passport.serializeUser(Admin.serializeUser());
// passport.serializeUser(User.serializeUser());

// passport.deserializeUser(Admin.deserializeUser());
// passport.deserializeUser(User.deserializeUser());




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


//Registration links


// app.get("/admin-register",function(req,res){
//     res.render("admin-reg.ejs")
// });

// app.get("/user-reg",function(req,res){
//     res.render("user-reg.ejs")
// });

app.get("/register-admin",function(req,res){
    res.render("register-admin.ejs");
});

app.get("/register-user",function(req,res){
    res.render("register-user.ejs");
});



app.get("/admin",function(req,res){
    if(req.isAuthenticated){
        res.render("admin");
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
        emailId:req.body.emailId
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

    




// Previous working module !!!!

    //          const newadmin = new Admin({
    //       username:req.body.username,
    //       firstname:req.body.firstname,
    //       lastname:req.body.lastname,
    //       emailId:req.body.emailId
          
    //   });
   
    //     Admin.register(newadmin,req.body.password,function(err,admin){
    //         if(err){
    //             console.log(err);
    //             res.redirect("/register-admin");
    //         }
    //         else{
                
    //             passport.authenticate("local")(req,res,function(){
    //                 res.redirect("/admin-login");
    //             });              
    //         }
    //     });
// end of module !!!


    //      const newadmin = new Admin({
    //       username:req.body.username,
    //       firstname:req.body.firstname,
    //       lastname:req.body.lastname,
    //       emailId:req.body.emailId,
    //       password:md5(req.body.password),
          
    //   });
    //   newadmin.save();

          
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
                    res.redirect("/admin");
                })
            }
        })
//     const username = req.body.username;
//     const password = md5(req.body.password);

//    Admin.findOne({username : username},function(err,foundUser){
//         if(err){
//             console.log(err);
//             alert("Not found");
//         }
//         else{
//             if(foundUser){
//                 if(foundUser.password == password){
//                     res.render("admin.ejs");
//                 }
//             }
//         }
//     })
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

    
        // User.register(newuser,req.body.password,function(err,user){
    
        //     if(err){
        //         console.log(err);
        //         res.redirect("/register-user");
        //     }
        //     else{
        //         res.redirect("/user-login");             
        //     }
        //  });
    
       
    

//     const newuser = new User({
//  username:req.body.username,
//  emailId:req.body.emailId
 
// });

// User.register(newuser,req.body.password,function(err,user){

//    if(err){
//        console.log(err);
//        res.redirect("/user-reg");
//    }
//    else{
       
//        passport.authenticate("local")(req,res,function(){
//            res.redirect("/user-login");
//        });              
//    }
// });

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













// app.post("/register", function(req, res){
//     var type = req.body.type
//     if(type=="user"){
//     const newuser = new User({
//         username:req.body.username,
//         firstname:req.body.username,
//         emailId:req.body.emailId
//    });

//     req.checkBody('username','UserName is Required').notEmpty();
//     req.checkBody('firstname','Your Name is Required').notEmpty();
//     req.checkBody('emailId','Email Required').notEmpty();
//     req.checkBody('emailId','Email Invalid').isEmail();
//     req.checkBody('password','Password is Required').notEmpty();
//     req.checkBody('repassword','Passwords do not match').equals(req.body.password);

//     User.register(newuser,req.body.password,function(err,user){

//         if(err){
//             console.log(err);
//             res.redirect("/user-reg");
//         }
//         else{
            
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/user-login");
//             });              
//         }
//      });

//    }


//    var type = req.body.type;
//     if(type=="admin"){
//        const newadmin = new Admin({
//         username:req.body.username,
//         firstname:req.body.firstname,
//         lastname:req.body.lastname,
//         emailId:req.body.emailId
//     });
 
//     req.checkBody('username','UserName is Required').notEmpty();
//     req.checkBody('firstname','First Name is Required').notEmpty();
//     req.checkBody('emailId','Email Required').notEmpty();
//     req.checkBody('emailId','Email Invalid').isEmail();
//     req.checkBody('password','Password is Required').notEmpty();
//     req.checkBody('repassword','Passwords do not match').equals(req.body.password);

//     Admin.register(newadmin,req.body.password,function(err,admin){
//         if(err){
//             console.log(err);
//             res.redirect("/register-admin");
//         }
//         else{
            
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/admin-login");
//             });              
//         }
//     });


// }
// })

//strategies

// passport.use('user', new LocalStrategy(function(username, password, done){
//     var query = {username: username};
//     User.findOne(query, function(err, student){
//         if(err) throw err;
//         if(!user){
//             return done(null, false);
//         }
//     })
// }))

// passport.use('admin', new LocalStrategy(function(username, password, done){
//     var query = {username: username};
//     Admin.findOne(query, function(err, admin){
//         if(err) throw err;
//         if(!admin){
//             console.log("no teach")
//             return done(null, false);
//         }
//     })
// }))

//serialize deserizlize

// passport.serializeUser(function (entity, done) {
//     done(null, { id: entity.id, type: entity.type });
// });

// passport.deserializeUser(function (obj, done) {
//     switch (obj.type) {
//         case 'user':
//             User.findById(obj.id)
//                 .then(user => {
//                     if (user) {
//                         done(null, user);
//                     }
//                     else {
//                         done(new Error('user id not found:' + obj.id, null));
//                     }
//                 });
//             break;
//         case 'admin':
//             Admin.findById(obj.id)
//                 .then(device => {
//                     if (device) {
//                         done(null, device);
//                     } else {
//                         done(new Error('device id not found:' + obj.id, null));
//                     }
//                 });
//             break;
//         default:
//             done(new Error('no entity type:', obj.type), null);
//             break;
//     }
// });












app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  