const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const answer_Schema=new Schema({ //schema for form that get for sumbit option in admin quetion
    mark:{ 
        type:Number,
        min:0,
    },
    type:Number,
    option1_answer_checkbox:['Number'],//for array of numbers
    correct_answer:Number,
    text_answer:String
});
const test_answer_Schema = new Schema({
    totalmarks: {
        type: Number,
        min: 0,
        required: true
    },
    totalmarksget: {
        type: Number,
        min: 0,
        required: true
    },
    quiz_code: {
        type: String,
        required: true,
        trim: true
    },
    form: [{
        type: Schema.Types.ObjectId,
        ref: "Answer",
        required: true
    }]
});

const Answer = new mongoose.model("Answer", answer_Schema);//model
const Test_answer = new mongoose.model("Test_answer", test_answer_Schema);//model

module.exports={Answer,Test_answer,test_answer_Schema,answer_Schema};
