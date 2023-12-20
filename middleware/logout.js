const jwt=require("jsonwebtoken");
const config= process.env;

const logOut= (req,res,next)=>{
    
    console.log(req.cookies);
    const token=req.cookies.jwt;

    if(!token){
        return res.render("login");
    }
    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
    }catch(err){
        console.log(err);
        res.locals.user=null;
        return res.render("login");
    }
    return next();
};
module.exports=verifyToken;