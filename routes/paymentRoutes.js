const express = require("express");
const router = express.Router();
const Payment = require("./../models/payment");
const {jwtAuthMiddleware, generateToken} = require("../jwt");
const jwt = require('jsonwebtoken');

router.post('/api/payment',async(req,res)=>{
    try{
        const data =  req.body;
        const payment = new Payment(data);
        const response = await payment.save();

        res.status(200).json({
            status: 200,
            message: "cart saved successfully",
            data: response,
            })

    }catch(err){
        console.error("Error saving data:", err);
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: err.message,
        });
    }
})
module.exports =router;