const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User=require("../models/User");
const Job=require("../models/Job");
const { ObjectId } = require("mongodb");
const validator=require('validator');
const auth=require("../middleware/auth");
const { render } = require("ejs");
const passport = require('passport');



module.exports.jobcreation_get=async(req,res)=>{
    res.render("jobcreation");
}
module.exports.protected_get= (req,res)=>{

}
module.exports.protected_get= (req,res)=>{

}
module.exports.auth_google_callback_get= (req,res)=>{
    passport.authenticate('google', { 
        successRedirect: '/protected',
        failureRedirect: '/login' }
        );
}
module.exports.auth_google_get= (req,res)=>{
    passport.authenticate('google', { scope: ['email','profile'] });
}
module.exports.jobcreation_post=async (req,res)=>{

    try{
        const checkJob=function (user_id,jobtitle,company_name){
            if(!user_id || !jobtitle || !company_name){   
                res.status(400).send("All the input are required");
                return false;
            }   
            return true;
        }
        const user_id=req.user.user._id;
        const { jobtitle,website,company_name,email,phone,address,origin,status,comments} = req.body;

        if(checkJob(user_id,jobtitle,company_name)&& user_id){
            const job= await Job.findOne({user_id,jobtitle,company_name});
            if(!job){
                 const job=await Job.create({
                    _id : new ObjectId(),
                    user_id : user_id,
                    jobtitle : jobtitle,
                    company_name : company_name,
                    ...website && {website : website},
                    ...email && {email : email},
                    ...phone && {phone : phone},
                    ...address && {address : address},  
                    ...origin && {origin : origin}, 
                    ...status && {status : status}, 
                    ...comments && {comments : comments},                   
                });
                res.redirect("/dashboard");
            }else{
                res.status(400).send("Job already exists !");
            }
            
        }
    }catch(err){
        console.log(err);
    }
    //res.send("creating a job...");
    
}
module.exports.signup_get= (req,res)=>{
    res.render("signup");
}
module.exports.login_get= (req,res)=>{
    res.render("login");
}
module.exports.login_post= async (req,res,next)=>{
    try{

        //locals !!!!
        const checkCredentials=function (email,password){
            if(!email || !password ){   
                res.status(400).send("All the input are required");
                return false;
            }
            if (!validator.isEmail(email,{})){
                res.status(400).send("Valid email required");
                return false;
            }   
            return true;
        }
        const { email,password } = req.body;
        if(checkCredentials(email,password)){
            const user= await User.findOne({email});
            if(user && await bcrypt.compare(password,user.password)){
                const token= jwt.sign(
                    {

                        user:{
                            _id: user._id, 
                            email : email,
                            firstname : user.firstname }
                        },
                        process.env.TOKEN_KEY,
                    {expiresIn : "2h"});
                    user.token=token;
                    await res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: 60*60*2*1000, // 3hrs in ms
                    });
                    next();
            }else{
                res.status(400).send("invalid credentials");
            }
            
        }
    }catch(err){
        console.log(err);
    }
}
module.exports.profile_get= async (req,res)=>{
    
    const user=await User.findOne({email : req.user.user.email});
    res.render("profile",{user : user});
}
module.exports.profile_post=async (req,res)=>{
    res.send("updating the profile");
}
module.exports.dashboard_get= async (req,res)=>{
        const list=await Job.find({user_id : req.user.user._id});
        const user={ id : req.user.user._id,firstname : req.user.user.firstname };
        res.render("dashboard",{list,user});
}
module.exports.signup_post=async (req,res)=>{
    console.log("@signup_post");
    const { firstname,lastname,email,password,password_repeat }= req.body;
    
    const checkUser=function (firstname,lastname,email,password,password_repeat){
        if( !firstname || !lastname || !email || !password || !password_repeat ){   
            res.status(400).send("All the input are required");
            return false;
        }
        if(password!==password_repeat){
            res.status(400).send("The password should be the same");
            return false;
        }
        if (!validator.isEmail(email,{})){
            res.status(400).send("Valid email required");
            return false;
        }     
        return true;
    }
    
    try{
        if(checkUser(firstname,lastname,email,password,password_repeat)){
            const oldUser= await User.findOne({ email });
        if(oldUser){
            return res.status(409).send("User already exist");
        }
        let encryptedPassword = await bcrypt.hash(password,10);
        if(!encryptedPassword){
            res.status(444).send("Something went wrong");
            return false;
        }
        const user=User.create({
            _id : new ObjectId(),
            firstname,
            lastname,
            email : email.toLowerCase(),
            password : encryptedPassword,
        });
        const token= jwt.sign(
            { _id : user._id, email,firstname },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
            user.token=token;
            await res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 60*60*2*1000, // 3hrs in ms
            });
            res.redirect("/login");
        }
    }catch(err){
        console.log(err);
        res.status(400);
    }
}    
module.exports.dashboard_post= (req,res)=>{
    res.send("dashboard post");
}
module.exports.update_post= async(req,res)=>{

    console.log("test");
    const list=await Job.find({user_id : req.user.user._id});
    const user={ id : req.user.user._id,firstname : req.user.user.firstname };
    res.render("dashboard",{list,user});
};
module.exports.delete_job_post= async (req,res)=>{
    try{
        await Job.deleteOne({ _id: req.body.job_id }); 
    }catch(err){
        res.status(400).send("Job does not exists !");
    }
    const list=await Job.find({user_id : req.user.user._id});
    res.render("dashboard",{user :req.user.user,list : list}); 
}      
module.exports.getjob_post = async (req, res) => {
    
    try {
        if (req.user["user"]._id == req.body.user_id) {
            const job = await Job.findOne({ _id: req.body.id });
            if (job) {
                res.render("dashboard", { list: req.list, job: job });
            } else {
                res.status(400).send("Job not found");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Job not found");
    }
};
module.exports.getjob_get = async (req, res) => {
 
    const job=await Job.findOne({ _id: req.params.id });
   
    res.render(`job`,{job : job});
};      
module.exports.jobupdate_get = async (req, res) => {
    const job=await Job.findOne({ _id: req.params.id });
    res.render("jobupdate",{ job : job});
};
module.exports.jobupdate_post = async (req, res) => {
    try {
        const checkJob = function ( jobtitle, company_name) {
            if (!jobtitle || !company_name) {
                res.status(400).send("All the input are required");
                return false;   
            }
            return true;
        };
        const user_id = req.user.user._id;
        const job_id = req.body.job_id;
        const { jobtitle,website ,contact_name, company_name, email, phone, address, origin, status, comments } = req.body;
        if (checkJob( jobtitle, company_name) && user_id) {
            const job = await Job.findOne({ _id : job_id});
            if (job) {
                const updateFields = {
                    ...(jobtitle && { jobtitle: jobtitle }),
                    ...(email && { email: email }),
                    ...(phone && { phone: phone }),
                    ...(company_name && { company_name: company_name }),
                    ...(contact_name && { contact_name: contact_name }),
                    ...(address && { address: address }),
                    ...(origin && { origin: origin }),
                    ...(status && { status: status }),
                    ...(comments && { comments: comments }),
                    ...(website && { website: website }),
                };

                const updatedJob = await Job.updateOne({ _id: job_id }, { $set: updateFields });
               /*  const job = await Job.updateOne(
                    { jobtitle,website ,contact_name, company_name, email, phone, address, origin, status, comments },
                    {
                        ...email && { email: email },
                        ...phone && { phone: phone },
                        ...company_name && { company_name: company_name },
                        ...contact_name && { contact_name: contact_name },
                        ...address && { address: address },
                        ...origin && { origin: origin },
                        ...status && { status: status },
                        ...comments && { comments: comments },
                        ...website && { website: website },
                    },
                    //{ new: true, upsert: false, remove: {}, fields: {} },
                ); */
                res.redirect("/dashboard");
            } else {
                res.status(400).send("Job does not exists !");
            }
        }
    } catch (err) {
        console.log(err);
    }   
};
module.exports.updatepassword_post = async (req, res) => {
    const { oldpassword,newpassword, newpassword_confirm } = req.body;
    if(!oldpassword || !newpassword || !newpassword_confirm){
        res.status(400).send("All the input are required");
        return false;
    }
    const user=await User.findOne({ _id: req.user.user._id });
    if(!user){
        res.status(400).send("User not found");
        return false;
    }else{
        if(!await bcrypt.compare(oldpassword,user.password)){
            res.status(400).send("Wrong password");
            return false;
        }else{
            let encryptedPassword = await bcrypt.hash(newpassword,10);
            const user=await User.updateOne(
                { _id: req.user.user._id },
                {
                    password : encryptedPassword,
                }
            );
            res.redirect("/profile");
        }
    }   
    if(newpassword!==newpassword_confirm){
        res.status(400).send("The password should be the same");
        return false;
    }
   
};
module.exports.logout_post = async (req, res) => {
    res.clearCookie("jwt").redirect("/login");
};
module.exports.profile_update_post = async (req, res) => {
    const { firstname, lastname, github } = req.body;
    const user=await User.updateOne(
        { _id: req.user.user._id },
        {
            firstname : firstname,
            lastname : lastname,
            github : github,
        }
    );
    res.redirect("/profile");
}
module.exports.upload_file = async (req, res) => {
    console.log(req.body);
    res.send("file uploaded");
}

