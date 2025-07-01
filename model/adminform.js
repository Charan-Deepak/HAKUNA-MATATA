const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const form_Schema=new Schema({ //schema for form that get for sumbit option in admin quetion
    question_no:Number,
    text:String,
    marks:{ 
        type:Number,
        min: 0,
    },
    type:Number,
    option1:[ 'String' ],//for array of options,
    option1_answer_checkbox:['Number'],//for array of numbers
    correct_answer:Number,
    text_answer:String
});

const test_Schema=new mongoose.Schema({
    time:Number,
    date:Date,
    quiz_name:String,
    random:String,//code
    form: [{
        type: Schema.Types.ObjectId,
        ref: "Form",
    },],//array forms
    students_attended: [{
        _id:false,
        student_ref:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        answer_ref: {
            type: Schema.Types.ObjectId,
            ref: "Test_answer",
        },
        username:String,
        marks:Number,
    },]
});

const Form=new mongoose.model("Form",form_Schema);//model
const Test = new mongoose.model("Test",test_Schema);//model
// const Test_student = new mongoose.model("Test_student", test_student_Schema);

module.exports={Form,Test,test_Schema,form_Schema};