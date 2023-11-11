const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

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

app.get("/",function(req,res){
    res.render("HomePage.ejs");
});

app.post("/admin-login",function(req,res){
   res.render("admin-login.ejs");
});

app.post("/user-login",function(req,res){
    res.render("user-login.ejs");
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  