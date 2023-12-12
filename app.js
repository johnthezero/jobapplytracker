require ("dotenv").config();
const { MONGO_URI } = process.env;
const mongoose = require("mongoose");
const express=require("express");
const routes=require("./routes/routes");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const app=express();
const PORT=3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set("view engine","ejs");
app.set("views","./views");

// LINK TO DB ↓ ▼ ↓


const dbURI =  "mongodb://127.0.0.1:27017/jobapptracker";

mongoose.connect(dbURI)
  .then((result) => {
    app.listen(PORT);
    console.log("Server listening on 3000");
    
  }).catch((err) => console.log(err));
  


  


