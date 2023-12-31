const { Router } = require("express");
const router=Router();
const cookieParser = require("cookie-parser");
const  auth =require("../middleware/auth");
const isLoggedIn = require("../middleware/isLoggedIn");
require("../middleware/google-auth");
// IMPLEMENT IT  ↓ ▼ ↓
const routeController=require("../controllers/routeController");



//router.get("/",routeController.get);
router.get("/login",routeController.login_get);
router.post("/login",routeController.login_post,(req,res)=>{
    res.redirect("dashboard");
});
router.get("/google/callback",routeController.auth_google_callback_get);
router.get("/protected",isLoggedIn,routeController.protected_get);
router.get("/auth/google",routeController.auth_google_get);
router.get("/signup",routeController.signup_get);
router.post("/logout",auth,routeController.logout_post);
router.post("/delete_job",auth,routeController.delete_job_post);
router.get("/profile",auth,routeController.profile_get);
router.post("/profile",auth,routeController.profile_post);
router.post("/signup",routeController.signup_post);
router.get("/dashboard",auth,routeController.dashboard_get);
router.post("/dashboard/",auth,routeController.dashboard_post);
router.post("/updatejob",auth,routeController.jobupdate_post);
router.get("/jobcreation",auth,routeController.jobcreation_get);
router.post("/jobcreation",auth,routeController.jobcreation_post);
router.post("/getjob",auth,routeController.getjob_post);    
router.post("/profile_update_post",auth,routeController.profile_update_post);
router.get("/job/:id",auth,routeController.getjob_get);
router.get("/jobupdate/:id",auth,routeController.jobupdate_get);
router.post("/updatepassword",auth,routeController.updatepassword_post);
router.use("/*",routeController.login_get);
module.exports = router;    