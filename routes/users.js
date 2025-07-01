const express=require('express');
const route=express.Router();
const {User}=require('../model/user');
const passport = require("passport");
const md5 = require("md5");
const { isUserLoggedIn }=require('../middleware');
const ControllerUser=require('../controller/user')

route.get("/login", ControllerUser.get_login);

route.get("/register", ControllerUser.get_register);

route.get("/home", isUserLoggedIn , ControllerUser.get_home);

route.get("/overview", isUserLoggedIn, ControllerUser.get_overview);

route.get("/depth", isUserLoggedIn, ControllerUser.get_depth);

route.get("/analytics", isUserLoggedIn, ControllerUser.get_graph);

route.post("/register", ControllerUser.post_register);

route.post("/login", passport.authenticate("user", {
    failureRedirect: "/user/login",
    failureFlash: "Invalid username or password",
}), ControllerUser.post_login);

route.get("/logout", ControllerUser.get_logout)

module.exports=route;