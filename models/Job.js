const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    _id :{
        type : String,
    },
    user_id : {
        type : String,
        required : true,
    },
    jobtitle : {
        type : String,
        required : true,
    },
    company_name : {
        type : String,
        required : true,
    },
    contact_name : {
        type : String,
        default : "",
    },
    email : {
        type : String,
        default : "",   
    },
    phone : {
        type : String,
        default : "",   
    },
    address : {
        type : String,
        default : "",
    },
    origin : {
        type : String,
        default : "",
    },
    status :{
        type : String,
        default : "",   
    },
    comments :{
        type : String,
        default : "",
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


const Job = mongoose.model('job',userSchema);

module.exports= Job;