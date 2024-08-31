const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true 
    },
    author:{
        type: String,
        required : true
    },
    totaltopic:{
        type: Number,
        required : true
    },
    status :{
        type: String,
        enum : ['active','inactive'],
        default : 'inactive'
    },   
},
{
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    versionKey : false
});

const Course = mongoose.model('Course' ,courseSchema)
module.exports  = Course;
    