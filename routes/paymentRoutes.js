const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Payment = require("./../models/payment");
const Cart = require("./../models/cart");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const jwt = require('jsonwebtoken');
const AuthService = require("../services/authService"); // Import the instance

router.post('/api/payment', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = await AuthService.getUserIdFromToken(req.headers.authorization);

        const data = req.body;
        let orderId = data.orderId;

        let orderData = await Order.findOne({
            _id: orderId
        });

        if (!orderData) {
            return res.status(404).json({
                status: 404,
                message: "Order not found",
            });
        }

        let cartId = orderData.cartId;

        let cartData = await Cart.findOne({
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
            "orderId": orderId,
            "userId": userId,
            "cartId": cartId,
            "paymentId": "success"
        }

        const newPayment = new Payment(newJson);
        const response = await newPayment.save();

        res.status(200).json({
            status: 200,
            message: "Payment saved successfully",
            data: response,
        });

    } catch (err) {
        console.error("Error processing payment:", err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});
module.exports = router;