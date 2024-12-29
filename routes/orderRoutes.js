const express = require("express");
const router = express.Router();
const Order = require("./../models/order");
const Course = require("./../models/course");
const cart = require("./../models/cart");
const {jwtAuthMiddleware, generateToken} = require("../jwt");
const jwt = require('jsonwebtoken');
const AuthService = require("../services/authService"); // Import the instance

router.post('/api/order',jwtAuthMiddleware,async(req,res)=>{
    try{
      const userId = await AuthService.getUserIdFromToken(req.headers.authorization);

      const data  = req.body;
      let cartId = data.cartId;

      let cartData = await cart.findOne({
        _id: cartId
      });

      if (!cartData) {
        return res.status(404).json({
          status: 404,
          message: "Cart not found",
        });
      }

      let courseId = cartData.courseId;
      
      const newJson = {
        "courseId": courseId,
        "userId": userId,
        "cartId": cartId,
        "paymentId": "unpaid"
      }

        const newOrder = new Order(newJson);
        const response = await newOrder.save();

        res.status(200).json({
            status: 200,
            message: "order saved successfully",
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
});

router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find().populate('courseId', 'title price');
      const totalAmount = orders.reduce((sum, order) => sum + (order.courseId.price || 0), 0);
      const orderResponse = orders.map(order => ({
        _id: order._id,
        userId: order.userId,
        course: {
          title: order.courseId.title,
          price: order.courseId.price,
          courseId : order.courseId._id
        },
        date: order.date
      }));
  
      res.json({
        status: 200,
        message: "Orders retrieved successfully",
        orders: orderResponse,
        totalAmount: totalAmount
      });
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ message: 'Error retrieving orders', error });
    }
  });
  
  
module.exports = router;
