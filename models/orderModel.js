import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Delivery",
        required: type
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    totalAmount: {
        type:Number,
        required: true
    },
    timeTaken: {
        type:Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "delivered", "cancelled"]
    },
    paymentStatus: {
        type:String,
        required: true,
        enum: ["Paid", "NotPaid"]
    }
},{timestamps: true});

const orderModel= new mongoose.Model("Order", orderSchema);
module.exports= orderModel;