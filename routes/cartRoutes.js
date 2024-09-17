const express = require("express");
const router = express.Router();
const Cart = require("./../models/cart");
const {jwtAuthMiddleware, generateToken} = require("../jwt");
const jwt = require('jsonwebtoken');

router.post('/api/cart', jwtAuthMiddleware,async(req,res)=>{
    try{
    const data  = req.body;
    const newCart = new Cart(data);
    const response  = await newCart.save();
    
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

router.get('/get/cart', jwtAuthMiddleware,async(req,res)=>{
    try{
        const cartData= await Cart.find().populate('courseId',' title price').exec();
        const CartResponse = cartData.map(cart=>({
            id: cart._id,
            courseId: cart.courseId._id,
            userId: cart.userId,
            paymentStatus: cart.paymentStatus,
            courseAmount: cart.courseId ? cart.courseId.price : null,
            course: cart.courseId ? cart.courseId.title : null

        }))
        res.status(200).json({
            status: 200,
            message: "cart retrieved successfully",     
            cartData :CartResponse
        })
    }catch(err){
        console.error("Error retrieving data:", err);
    }
})
module.exports = router ;