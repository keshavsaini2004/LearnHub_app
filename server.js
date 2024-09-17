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

 //Import the router files
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const topicRoutes = require('./routes/topicRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

//Use the router files
app.use('/user',userRoutes);
app.use('/course',courseRoutes);
app.use('/topic',topicRoutes);  
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})