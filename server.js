const express = require('express')
const app = express()
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');
const redis = require('./redisClient');
console.log("redis")


const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//Middleware Functions
const logRequest =(req,res,next) =>{
  console.log(`[${new Date().toLocaleString()}]Request made to :${req.originalUrl}`);
  next();//move on the next phase
}
app.use(logRequest);


 //Import the router files
const userRoutes = require('./routes/userRoutes');

//Use the router files
app.use('/user',userRoutes);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})