const express = require("express");
const router = express.Router();
const User  = require("./../models/user");
const {jwtAuthMiddleware, generateToken} = require("./../jwt");
const jwt = require('jsonwebtoken');
const { setValue, getValue } = require('../redisClient');

      

router.post("/signup", async (req,res) =>{
    try{
      const data = req.body;
      
      const generateUsername = (name) => {
        const cleanedName = name.replace(/\s+/g, '').toLowerCase(); 
        const randomNumber = Math.floor(Math.random() * 9000) + 1000; 
        return `${cleanedName}_${randomNumber}`; 
      };
      
      const username = generateUsername(data.name);

      const insertJson = {
        name: data.name,
        username: username,
        age: data.age,
        mobile: data.mobile,
        email: data.email,
        password: data.password,
        user_type: data.user_type
      };
      
      const newUser = new User(insertJson);
      const response = await newUser.save();


      const payload = {
        user_id: response._id,
        email: response.email,   
      };
      const token = generateToken(payload);
     

      const redisData = { 
          ...response._doc,
          token
      };
      await setValue(`user:${response.id}`, redisData);
        res.status(200).json({
        success:true,
        status: 200,
        message: "Data saved successfully",
        data: response,
        token: token
      });
    }catch (err) {
      console.error("Error saving data:", err);
      res.status(500).json({
        success:false,
        status: 500,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  });

  

  router.post("/login",async(req,res)=>{
    try{
         // Extract email  and password from request body
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email: email });

      // If user does not exist or password does not match, return error
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
        // generate Token
      const payload = {
        user_id: user._id,
        email: user.email,
      };
      
      const token = generateToken(payload);

      // return token as response
      res.json({
        success:true,
        token : token,
        message: "login success",
        user_type:user.user_type ? user.user_type : 'user'
      });
    }catch(err){
        console.error(err);
        res.status(500).json({success:false, message: "Internal Server Error" });
    }
  })

  router.get('/user-details', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is stored in the token
 
    try {
      const userDetails = await getValue(`user:${userId}`);
      if (!userDetails) {
        return res.status(404).json({ error: 'User not found in Redis' });
      }
  
      res.status(200).json(userDetails);
    } catch (err) {
      console.error('Error getting user details from Redis:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  router.get('/verify', jwtAuthMiddleware, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = router;