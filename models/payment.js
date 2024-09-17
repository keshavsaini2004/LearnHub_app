const mongoose = require ('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','success','failed'],
        default:'pending'
    }
})
const Payment= mongoose.model('Payment',paymentSchema);
module.exports = Payment;
