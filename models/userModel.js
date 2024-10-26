import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    mobileNo: {
        type:Number,
        required: true
    },
   image: {
    type:String
   },
   role: {
    type: String,
    enum: ['user','restaurant_owner', 'delivery_agent', 'admin'],
    default: 'user'
   },
   address: [
    {
        tag: {
            type: String
        },
        houseNo: {
            type:String,
            required: true
        },
        streetNo: {
            type:String
        },
        location: {
            type:String
        },
        pincode: {
            type:String
        }
    }
   ]
},{
    timestamps: true
});
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password, process.env.SALT_ROUNDS);
        next();
    }
})
userSchema.methods.generateAuthToken= async function(){
    try{
        let token=jwt.sign({
            id: this._id,
            email: this.email
        }, process.env.SECRET_KEY,{
            expiresIn: '24h'
        });
        return token;
    }
    catch(err){
        throw new Error("Error while generating Auth Token");
    }
}

const userModel= mongoose.model("User", userSchema);
export default userModel;
