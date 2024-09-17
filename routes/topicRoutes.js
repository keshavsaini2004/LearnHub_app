const express = require("express");
const router = express.Router();
const Topic = require("./../models/topic");
const {jwtAuthMiddleware, generateToken} = require("./../jwt");
const jwt = require('jsonwebtoken');
const { setValue, getValue } = require('../redisClient');

router.post('/api/topics',jwtAuthMiddleware,async(req,res) =>{
    try{
        const data = req.body;
        const newTopic = new Topic(data);
        const response = await newTopic.save();

         console.log("topic saved successfully");
     
         const redisData = { 
             ...response._doc,
         };
         await setValue(`user:${response.id}`, redisData);      
         
         res.status(200).json({
            status: 200,
            message: "Topic saved successfully",
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
// get all topics
router.get('/get/topics',jwtAuthMiddleware,async(req,res)=>{
    try{
    const topics = await Topic.find();
    res.status(200).json({
        status: 200,
        message: "Topics retrieved successfully",
        data: topics,
    })
    }catch(err){
    console.error("Error retrieving topics:", err);
    }
})
// get topic by id
router.get('/get/topics/:topicId',jwtAuthMiddleware,async(req,res)=>{
    try{
        const topicId = req.params.topicId;
        const topic = await Topic.findById(topicId);
        if(!topic){
            return res.status(404).json({
                status: 404,
                message: "Topic not found",
            })
        }
        res.status(200).json({
            status: 200,
            message: "Topic retrieved successfully",
            data: topic,
        })

    

    }catch(err){
        console.error("Error retrieving topic:", err);
    }
})
// update topic by id
router.put('/update/topics/:topicId',jwtAuthMiddleware,async(req,res)=>{
    try{
        const topicId = req.params.topicId;
        const updatedTopicData = req.body
        const topic = await Topic.findByIdAndUpdate(topicId,updatedTopicData,{
            new:true,
            runValidators:true   
        });
        if(!topic){
            res.status(404).json({
                status: 404,
                message: "Topic not found",
            })
        }
        res.status(200).json({
            status: 200,
            message: "Topic updated successfully",
            data: topic
        })
    }catch(err){
        console.error("Error updating Topic by id:", err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
        });
    }
})
// delete topic by id
router.delete('/delete/topics/:topicId',jwtAuthMiddleware,async(req,res)=>{
    try{
        const topicId = req.params.topicId;
        const topic = await Topic.findByIdAndDelete(topicId);
        if(!topic){
            return res.status(404).json({
                status: 404,
                message: "Topic not found",
            })
        }
        res.status(200).json({
            status :200,
            message: "Topic deleted successfully",
        })

    }catch(err){
        console.error("Error Deleting Topic by id:", err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
        });
    }
})
module.exports = router;    