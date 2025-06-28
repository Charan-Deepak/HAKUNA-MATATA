const express=require('express')
const route=express.Router();
const passport = require("passport");
const {isAdminLoggedIn}=require('../middleware');
const ControllerAdmin=require('../controller/admin')

route.get("/login", ControllerAdmin.get_login);

route.get("/register", ControllerAdmin.get_register);

route.get("/home", isAdminLoggedIn, ControllerAdmin.get_home);

route.post("/register", ControllerAdmin.post_register);

route.post("/login", passport.authenticate("admin", {
    failureRedirect: "/admin/login",
    failureFlash: "Invalid username or password"//stores in error
}), ControllerAdmin.post_login);

route.get("/logout", ControllerAdmin.get_logout);

module.exports=route;