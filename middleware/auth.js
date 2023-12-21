const jwt=require("jsonwebtoken");
const config= process.env;

const verifyToken= (req,res,next)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.render("login");
    }
    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        console.log(decoded);
        req.user = decoded;
    }catch(err){
        console.log(err);
        res.locals.user=null;
        return res.render("login");
    }
    console.log("TEST");
    return next();
};
module.exports=verifyToken;
