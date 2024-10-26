import mongoose from "mongoose";

const reviewSchema= mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    rating: {
        type: Number,
        default: 4,
        validate: {
            validator: (value)=> value >=1 && value<=5,
            message: 'Rating must be between 1 and 5'
        }
    },
    comment: {
        type: String,
        default: "Good"
    }
});
const reviewModel= new mongoose.model("Review", reviewSchema);
module.exports= reviewModel;
