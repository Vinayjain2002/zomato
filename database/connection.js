import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        const connectionUrl= process.env.MONGO_URL || "mongodb://localhost:27017/zomato";
          mongoose.connect(connectionUrl);
          console.log("Connected to Database");
    }
    catch(err){
        console.log("Error while connecting to Database")
    }
}