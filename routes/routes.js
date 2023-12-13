const { Router } = require("express");
const router=Router();
const cookieParser = require("cookie-parser");
const  auth =require("../middleware/auth");
// IMPLEMENT IT  ↓ ▼ ↓
const routeController=require("../controllers/routeController");



router.get("/",routeController.get);
router.get("/index",routeController.index_get);
router.get("/login",routeController.login_get);
router.post("/login",routeController.login_post,(req,res)=>{
    console.log(req.cookies);
    res.redirect("dashboard");
});
router.get("/signup",routeController.signup_get);
router.get("/profile",auth,routeController.profile_get);
router.post("/profile",auth,routeController.profile_post);
router.post("/signup",auth,routeController.signup_post);
router.get("/dashboard",auth,routeController.dashboard_get);
router.post("/dashboard/",routeController.dashboard_post);
router.post("/updatejob",auth,routeController.update_post);
router.get("/jobcreation",auth,routeController.jobcreation_get);
router.post("/jobcreation",auth,routeController.jobcreation_post);
module.exports = router;