const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const user_Schema = new Schema({
    role: {
        type: String,
        default: 'user'
      },
    username: {
        type: String,
        required: true,
    },
    firstname: {
        type:String,
        required: true,
    },
    lastname: String,
    emailId:
    {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    repassword:{
        type: String,
    },
    test_answer: [{
        _id: false,
        answer_ref: {
            type: Schema.Types.ObjectId,
            ref: "Test_answer"
        },
        test_ref: {
            type: Schema.Types.ObjectId,
            ref: "Test"
        },
        quiz_code: String,
        end_date: Date
    }]
});

//it help to default creation of username and password fields with hash with salt
user_Schema.plugin(passportLocalMongoose);
//creation of model to user schema
const User = new mongoose.model("User",user_Schema);

module.exports={User,user_Schema};