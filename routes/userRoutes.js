const express = require("express");
const router = express.Router();
const User  = require("./../models/user");
const {jwtAuthMiddleware, generateToken} = require("./../jwt");
const jwt = require('jsonwebtoken');
const { setValue, getValue } = require('../redisClient');

      

router.post("/signup", async (req,res) =>{
    try{
      const data = req.body //Assuming the request body contains the user data  
      const newUser = new User(data);// creating the new user document using the mongoose model
      const response = await newUser.save();// saving the new user document to the database
      
      console.log("data saved successfully");

      const payload = {
        id: response.id,
        email: response.email,
      };
      console.log(JSON.stringify(payload));
      const token = generateToken(response.email);

      const redisData = {
          ...response._doc,
          token
      };
      await setValue(`user:${response.id}`, redisData);

      console.log("Token is :",token );
        res.status(200).json({
        status: 200,
        message: "Data saved successfully",
        data: response,
        token: token
      });
    }catch (err) {
      console.error("Error saving data:", err);
      res.status(500).json({
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
        id: user.id,
        email: user.email,
      };
      
      const token = generateToken(payload);

      // return token as response
      res.json({ token });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
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

//comment added for testing purpose for git hub


  module.exports = router;