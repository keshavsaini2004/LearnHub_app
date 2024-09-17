const mongoose =  require('mongoose');

const orderSchema = new mongoose.Schema ({

    cartId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    paymentId : {
        type:String
    },
    date:
     { type: Date,
       default: Date.now
     }
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
