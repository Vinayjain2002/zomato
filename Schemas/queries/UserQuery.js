import graphql from "graphql";
const { UserType, AuthType } = require("../Type.js");
const User = require("../../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isAuth = require("../../middleware/isAuth.js");

const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const login = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    let query = await User.findOne({ email: args.email });
    if (!query) {
      throw new Error("User does not exists");
    } else {
      // so the user exists and compairing the passwords
      let isEqual = await bcrypt.compare(args.password, query.password);
      if (!isEqual) {
        throw new Error(`Password is incorrect`);
      } else {
        const accessToken = await query.generateAuthToken();
        const refreshToken = await query.generateRefreshToken();
        // setting the expiry date of the tokens
        const accessTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const refreshTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        return {
          username: query.username,
          email: query.email,
          mobileNo: query.mobileNo,
          image: query.image,
          role: query.role,
          id: query._id,
          address: query.address,
          accessToken: accessToken,
          refreshToken: refreshToken,
          accessTokenExp: accessTokenExp,
          refreshTokenExp: refreshTokenExp
        }
      }
    }
  },
};

const getUserDetail= {
    type: UserType,
    args: {
        type: new GraphQLNonNull(GraphQLID),
    },
    async resolve(parent, args,{req}){
        if (!req.rootUser || req.rootUser.role !== 'admin') {
            throw new Error("Access denied: Admins only");
        }
        try{
            if(!req.isAuth){
                throw new Error("Unauthenticated user!")
            }else{
                let user= await User.findOneById(args.id);
                return user;
            }
        }
        catch(err){
            throw new Error("Failed to fetch users");
        }
    }
}

const getAllUsers= {
    type: new GraphQLList(UserType),
    async resolve(parent,args,{req}){
         // Check if the user is admin
         if (!req.rootUser || req.rootUser.role !== 'admin') {
            throw new Error("Access denied: Admins only");
        }
        try {
            const users = await User.find({"role": 'user'});
            return users;
        } catch (err) {
            throw new Error("Failed to fetch users");
        }
    }
}

const getAllAdmin= {
    type: new GraphQLList(UserType),
    async resolve(parent, args, {req}){
        if(!req.rootUser || req.rootUser.role !== 'admin'){
            throw new Error("Access denied: Admins only")
        }
        try{
            const users= await User.find({"role": 'admin'})
            return users;
        }
        catch(err){
            throw new Error("Failed to fetch users");
        }
    }
}

const getAllRestaurnatOwner= {
    type: new GraphQLList(UserType),
    async resolve(parent, args, {req}){
        if(!req.rootUser || req.rootUser.role !== 'admin'){
            throw new Error("Access denied: Admins only")
        }
        try{
            const users= await User.find({"role": 'restaurant_owner'})
            return users;
        }
        catch(err){
            throw new Error("Failed to fetch users");
        }
    }
}

const getAllDeliveryPartner= {
    type: new GraphQLList(UserType),
    async resolve(parent, args, {req}){
        if(!req.rootUser || req.rootUser.role !== 'admin'){
            throw new Error("Access denied: Admins only")
        }
        try{
            const users= await User.find({"role": 'delivery_agent'})
            return users;
        }
        catch(err){
            throw new Error("Failed to fetch users");
        }
    }
}


module.exports= {
    login,
    getUserDetail,
    getAllUsers,
    getAllDeliveryPartner,
    getAllRestaurnatOwner,
    getAllAdmin
}