const mongoose=require("mongoose");
const { isEmail } = require("validator");
const validator = require("validator");

const userSchema=new mongoose.Schema({
    _id :{
        type : String,
    },
    firstname : {
        type : String,
        required : true,
    },
    lastname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    github : {
        type : String,
        default : "",
    },
    picture : {
        type : String,
        default : "",
    },
    cvlink : {
        type : String,
        default : "",
    },
    password :{
        type : String,
        required : true,
        minlength : 8,
    },
    jobs_ids :{
        type : [String],
        default : [],
    },
    settings :{
        type : [String],
        default : [],
    },
    date_of_creation : {
        type : Date,
        default : Date.now,
    },
    last_updates : {
        type : [Date],
        default : [],
    }

});


const User = mongoose.model('user',userSchema);

module.exports= User;