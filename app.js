require ("dotenv").config();
const { MONGO_URI } = process.env;
const passport = require("passport");
const mongoose = require("mongoose");
const express=require("express");
const session=require("express-session");
const routes=require("./routes/routes");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const app=express();
const PORT=3000;
const path=require("path");
app.use(express.static(__dirname+'/public/'));

app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.json());
app.use(cookieParser());
app.use(session({secret : '321321321'}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// LINK TO DB ↓ ▼ ↓

const dbURI_local = "mongodb://localhost:27017/jobapptracker";
const dbURI =  `mongodb+srv://jonthezero:${process.env.MONGO_URI}@cluster0.9rolcn7.mongodb.net/jobapplytrack`;


mongoose.connect(dbURI)
  .then((result) => {
    app.listen(PORT);
    console.log("Server listening on 3000");
    
  }).catch((err) => console.log(err));



  app.use(routes);

module.exports = app;
  


