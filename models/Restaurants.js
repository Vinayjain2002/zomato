import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    tag: {
      type: String,
    },
    houseNo: {
      type: String,
      required: true,
    },
    streetNo: {
      type: String,
    },
    location: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  phoneNo: [
    {
        type:String,
        required: true
    }
  ],
  cuisine: {
    type:String
  },
  rating: {
    type: Number,
    default: 3,
    validate: {
        validator: (value)=> value >=1 && value<=5,
        message: 'Rating must be between 1 and 5'
    }
  },
  ownerId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);
module.exports = restaurantModel;
