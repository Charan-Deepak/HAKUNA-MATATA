const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose=require('mongoose');
const app = express();
const morgan=require('morgan');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(morgan("dev"));

mongoose.connect("mongodb://localhost:27017/Quiz");
const articleschema=new mongoose.Schema({
    title:String,
    content:String
});
const Article=mongoose.model("Article",articleschema);
const article1=new Article(
    { title:"hiklsnglkdnfg;",
        content:"helloesrjygesorpjgo"
    });

article1.save();



app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/mdb-ui-kit/css"))
);


app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/mdb-ui-kit/js"))
);

app.use(
    "/dev",
    express.static(path.join(__dirname, "node_modules/mdb-ui-kit/dev"))
);



app.get("/",function(req,res){
    res.render("HomePage.ejs");
});

app.post("/admin-login",function(req,res){
   res.render("admin-login.ejs");
});

app.post("/user-login",function(req,res){
    res.render("user-login.ejs");
});

app.get("/features",function(req,res){
    res.render("features.ejs")
});

app.get("/admin",function(req,res){
    res.render("register-admin.ejs")
});





app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  