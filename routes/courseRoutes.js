const express = require("express");
const router = express.Router();
const Course = require("./../models/course");
const {jwtAuthMiddleware, generateToken} = require("./../jwt");
const jwt = require('jsonwebtoken');
const { setValue, getValue } = require('../redisClient');


// Create a new course 
router.post('/api/courses',jwtAuthMiddleware,async(req,res) =>{
  try{
    const data = req.body;
    const newCourse = new Course(data);
    const response = await newCourse.save();

    console.log("Course saved successfully");

    // const payload = {
    //     id: response.id,
    // }
    //     console.log(JSON.stringify(payload));
    //     const token = generateToken(response.id);

        const redisData = { 
            ...response._doc,
            // token
        };
        await setValue(`user:${response.id}`, redisData);

    // console.log("Token is :",token );
        res.status(200).json({
        status: 200,
        message: "Course saved successfully",
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

// Get all courses
router.get('/get/courses',async(req,res) =>{
    try{
        const courses = await Course.find();
        res.status(200).json({
            status: 200,
            message: "Courses retrieved successfully",
            data: courses,
        })
    }catch(err){
        console.error("Error fetching courses:", err);
    }
});

//get the courses by courseId
router.get('/getcourse/:courseId',jwtAuthMiddleware,async(req,res) =>{
    try{
        const courseId = req.params.courseId ;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                status: 404,
                message: "Course not found",
            })
        }
        res.send(course);

    }catch(err){
        console.error("Error fetching course by id:", err);
    }
})

//update the course by id
router.put('/update/course/:courseId', jwtAuthMiddleware, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const updatedCourseData = req.body;
        
        const course = await Course.findByIdAndUpdate(courseId, updatedCourseData, {
            new: true,  // Return the updated document
            runValidators: true  // Validate the updated data
        });
        
        if (!course) {
            return res.status(404).json({
                status: 404,
                message: "Course not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Course updated successfully",
            data: course,
        });

    } catch (err) {
        console.error("Error updating course by id:", err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
        });
    }
});


// delete the course by course id
router.delete('/delete/course/:courseId',jwtAuthMiddleware, async(req,res) =>{
    try{
        const courseId = req.params.courseId ;
        const course =  await Course.findByIdAndDelete(courseId);
        if(!course){
            return res.status(404).json({
                status: 404,
                message: "Course not found",
            })
        }
        res.status(200).json({
            status: 200,
            message: "Course deleted successfully",
        })
    }catch(err){
        console.error("Error deleting course by id:", err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message,
        })
    }

})


module.exports =  router ;