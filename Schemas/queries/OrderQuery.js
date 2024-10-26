const graphql = require("graphql");
const { OrderType } = require("../Type.js");
const Order = require("../../models/orderModel.js");
const Review = require("../../models/Review.js");
const { GraphQLDate } = require('graphql-iso-date');
const { GraphQLFloat } = require("graphql");

const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQL
} = graphql;

const fetchUserAllOrders = {
  type: new GraphQLList(OrderType),
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, { req }) {
    if (
      !req.rootUser ||
      (req.rootUser.role !== "admin" && req.userId !== args.userId)
    ) {
      throw new Error("Access denied: Admins only");
    }
    try {
      const orders = await Order.find({ userId: args.userId })
        .populate("deliveryPartner")
        .populate("restaurantId");
      if (!orders.length) {
        return []; // Return an empty array instead of a message
      } else {
        return orders;
      }
    } catch (err) {
      throw new Error("Error while finding Data");
    }
  },
};

const particularOrder = {
  type: OrderType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, { req }) {
    try {
        const order= await Order.findOneById(id).populate('userId').populate('restaurantId').populate('deliveryPartner');
        const reviews= await Review.find({orderId: args.orderId});
        return {
            order,
            reviews
        };
    } catch (err) {
      throw new Error("Error while finding Data");
    }
  },
};

const searchOrder = {
    type: new GraphQLList(OrderType),
    args: { 
        orderDate: { type: GraphQLDate },
        totalAmount: { type: GraphQLFloat },
        status: { type: GraphQLString },
        paymentStatus: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const query = {};
        if (args.orderDate) {
            query.orderDate = args.orderDate; // Exact match for orderDate
        }
        if (args.totalAmount) {
            query.totalAmount = args.totalAmount; // Exact match for totalAmount
        }
        if (args.status) {
            query.status = { $regex: args.status, $options: "i" }; // Case-insensitive regex match for status
        }
        if (args.paymentStatus) {
            query.paymentStatus = { $regex: args.paymentStatus, $options: "i" }; // Case-insensitive regex match for paymentStatus
        }
        try {
            const orders = await Order.find(query);
            return orders; // Return the found orders
        } catch (err) {
            throw new Error("Error while searching for orders: " + err.message);
        }
    }
};

const fetchOrderwithRestaurant = {
    type: new GraphQLList(OrderType),
    args: {
        restaurantId: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    async function(parent,args){
        const order= await Order.find({restaurantId: args.restaurantId}).populate('userId').populate('restaurantId');
        return order
    }
};

module.exports= {
    fetchUserAllOrders,
    fetchOrderwithRestaurant,
    searchOrder,
    particularOrder
};