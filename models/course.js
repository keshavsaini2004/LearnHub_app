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
    amount:{
        type: Number,
        required : true
    },
    totaltopic:{
        type: Number,
        required : true
    },
    status :{
        type: String,
        enum : ['active','inactive'],
        default : 'active'
    },  
    price:{
        type: Number,
        required : true
    },
    topics: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Topic'
         }] 
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
    