const mongoose =  require('mongoose');

const topicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    status : {
        type: String,
        enum : ['active','inactive'],
        default : 'inactive'
    },
    courseId :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Course'
    }
},
{
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    versionKey : false
})

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
