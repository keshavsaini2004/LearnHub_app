const express = require("express");
const router = express.Router();
const Order = require("./../models/order");
const Course = require("./../models/course");
const {jwtAuthMiddleware, generateToken} = require("../jwt");
const jwt = require('jsonwebtoken');

router.post('/api/order',async(req,res)=>{
    try{
        const data = req.body;
        const newOrder = new Order(data);
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
