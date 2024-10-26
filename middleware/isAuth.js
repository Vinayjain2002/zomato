const jwt= require('jsonwebtoken')
import User from '../models/userModel.js'

export const Auth= async (req,res,next)=>{
   try{
    const authHeader= req.headers.authorization;
    if(authorization){
        const token= authHeader.split(' ')[1];
        const verifiedUser= jwt.verify(token, process.env.SECRET_KEY);
        const rootUser= await User.findOne({_id: verifiedUser.id}).select('-password');
        if(!rootUser){
            return res.status(401).json({"message": "User not found"});
        }
        req.token= token;
        req.rootUser= rootUser;
        req.userId= rootUser._id;
        next();
    }
   }catch(err){
    return res.status(401).json({ message: "Error while finding the Auth User", error: err.message });
   }
}

export const isAdmin= (req,res,next)=>{
    try{
        if(req.rootUser && req.rootUser.role=='admin'){
            next();
        }
        else{
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
    }
    catch(err){
        return res.status(500).json({ message: "Error while checking Admin", error: err.message });
    }
}


export const isRestaurnatOwner= (req,res,next)=>{
    try{
        if(req.rootUser && req.rootUser.role=='restaurant_owner'){
            next();
        }
        else{
            return res.status(403).json({ message: "Access denied: Restaurant Owner only" });
        }
    }
    catch(err){
        return res.status(500).json({ message: "Error while checking REstaurant Owner", error: err.message });
    }
}


export const isDeliveryAgent= (req,res,next)=>{
    try{
        if(req.rootUser && req.rootUser.role=='delivery_agent'){
            next();
        }
        else{
            return res.status(403).json({ message: "Access denied: Delivery Agent only" });
        }
    }
    catch(err){
        return res.status(500).json({ message: "Error while checking Delivery Agent Owner", error: err.message });
    }
}

