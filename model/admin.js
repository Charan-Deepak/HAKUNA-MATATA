const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const admin_Schema = new Schema({
    role: {
        type: String,
        default: 'admin'
    },
    username: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: String,
    emailId:
    {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,

    },
    repassword: {
        type: String,
        required: true,
    },
    test: [{
        type: Schema.Types.ObjectId,
        ref: "Test",
    }]
});

admin_Schema.plugin(passportLocalMongoose);
const Admin = new mongoose.model("Admin", admin_Schema);

module.exports={Admin,admin_Schema};