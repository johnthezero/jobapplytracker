const jwt=require("jsonwebtoken");
const config= process.env;

const verifyToken= (req,res,next)=>{
    
    //const token= req.headers["x-access-token"] || req.body.token || req.query.token || req.headers["Authorization"];
    console.log(req.cookies);
    const token=req.cookies.jwt;

    //console.log("headers -> cookie --> jwt");
    //console.log(req.headers);
    console.log(token);
    if(!token){
        console.log("A token is required");
        return res.render("login");
    }
    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        console.log("TOKEN OK");
        req.user = decoded;
    }catch(err){
        console.log(err);
        res.locals.user=null;
        return res.render("login");
    }
    return next();
};
module.exports=verifyToken;