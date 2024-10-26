import mongoose from "mongoose";

const deliverySchema= mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 3,
        validate: {
            validator: (value)=> value>=1 && value <=5, 
            message: 'Rating must be between 1 and 5'
        }
    }
});

const deliveryModel= new mongoose.model("Delivery", deliverySchema);
module.exports= deliveryModel;