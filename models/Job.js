const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    _id :{
        type : String,
    },
    user_id : {
        type : String,
        unique : false
    },
    jobtitle : {
        type : String,
        required : true,
    },
    company_name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
    },
    phone : {
        type : String,
        default : "",   
    },
    adress : {
        type : String,
        default : "",
    },
    origin : {
        type : String,
        required : true,
        default : "",
    },
    status :{
        type : String,
        required : true,
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