import mongoose from "mongoose";

const menuSchema= mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    itemName: {
        type:String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type:Number,
        required: true
    },
    category: {
        type:String,
        enum: ["veg", "non-veg"],
        default: "veg"
    },
    discount: {
        type: Number
    },
    images: [
        {
            type: String,
            required: true
        }
    ]
}, {
    timestamps: true
});

const menuModel= new mongoose.model("Menu", menuModel);
module.exports= menuModel;
