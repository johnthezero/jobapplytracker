const { isTemplateTail, ObjectFlags } = require("typescript");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("../models/User");
const Job=require("../models/Job");
const { ObjectId } = require("mongodb");
//module.exports.checkUser=(id,password)=>{
const validator=require('validator');
//const { isEmail  } = require("validator");
const auth=require("../middleware/auth");

// TO IMPLEMENT
/* module.exports.checkAuth=(request)=>{
    if(request.firstname && request.lastname && password && email){
        if(isEmail())return true;
    }
} */

module.exports.jobcreation_get=(req,res)=>{
    res.render("jobcreation");
}
module.exports.jobcreation_post=async (req,res)=>{
    try{
        const checkJob=function (jobtitle,company_name,origin,status){
            if(!jobtitle || !status || !company_name || !origin){   
                res.status(400).send("All the input are required");
                return false;
            }   
            return true;
        }
        const { jobtitle,company_name,origin,status } = req.body;
        if(checkJob(jobtitle,company_name,origin,status)){
            const job= await Job.findOne({jobtitle,company_name,origin,status});
            if(!job){
                console.log("Creating a job...");
                 const job=await Job.create({
                    _id : new ObjectId(),
                    user_id : req.user.user_id,
                    jobtitle : jobtitle,
                    company_name : company_name,
                    origin : origin,
                    status : status,
                });
                const test=await Job.findOne({user_id : "65707ebd530c84631d827abd"});
                res.json(test);
                //next();
                   /*  console.log("next...");  
                    console.log(user.token);
                    next(); */
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
            console.log('user valid') ;    
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
                    //console.log(token);
                    await res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: 60*60*2*1000, // 3hrs in ms
                    });
                    
                    //res.json(user);
                    //WTF ?
                    //res.locals.user=user;
                    //console.log(res.locals.user);
                    //console.log(req.cookies);
                    //console.log("next");
                    next();
            }else{
                res.status(400).send("invalid credentials");
            }
            
        }
    }catch(err){
        console.log(err);
    }
}
module.exports.profile_get= (req,res)=>{
    let obj={
        firstname : "Jon",
        lastname : "Mi",
        email: "test@example.com",
        github : "www.mysupergithubrepo.com",
    }
    res.render("profile",obj);
}
module.exports.profile_post= (req,res)=>{
    res.send("updating the profile");
}
module.exports.dashboard_get= (req,res)=>{
   /*  if(res.locals.user){
        const { _id, email, firstname }=res.locals.user;
    } */
    //console.log(locals.user);
        const object={
            id : "id",
            email : "email", 
            firstname : "firstname",
        }
        /* const obj={
            id : _id,
            email : email,
            firstname : firstname,
        } */
        res.render("dashboard");
}
module.exports.signup_post=async (req,res)=>{
    const { firstname,lastname,email,password }= req.body;
    
    const checkUser=function (firstname,lastname,email,password){
        if( !firstname || !lastname || !email || !password ){   
            res.status(400).send("All the input are required");
            return false;
        }
        if (!validator.isEmail(email,{})){
            res.status(400).send("Valid email required");
            return false;
        }     
        return true;
    }
    
    try{
        if(checkUser(firstname,lastname,email,password)){
            const oldUser= await User.findOne({ email });
        if(oldUser){
            return res.status(409).send("User already exist");
        }
        let encryptedPassword = await bcrypt.hash(password,10);
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
            console.log(user);
            
            res.status(201).json(user);
        }
    }catch(err){
        console.log(err);
        res.status(400);
    }
}    
        
        


module.exports.dashboard_post= (req,res)=>{
    res.send("dashboard post");
}

module.exports.get=(req,res)=>{

    res.render("index",{ message : "Truc à implémenter"});
}
module.exports.index_get=(req,res)=>{
    res.redirect("/");
    console.log("index");
}
module.exports.update_post= (req,res)=>{
    res.render("index");
}