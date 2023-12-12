const jwt=require("jsonwebtoken");
const config= process.env;

const verifyToken= (req,res,next)=>{
   
    const token= req.headers["x-access-token"] || req.body.token || req.query.token || req.headers["Authorization"];
    
    
    //console.log("headers -> cookie --> jwt");
    //console.log(req.headers);
   /*  if(!token){
        console.log("A token is required");
        return res.render("login");
    }
    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
        console.log("user : ",req.user);
    }catch(err){
        console.log("test Err");
        res.locals.user=null;
        return res.render("login");
    } */
    return next();
};
module.exports=verifyToken;