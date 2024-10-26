const graphql = require("graphql");
const { ReviewType } = require("../Type/js");
const Review = require("../../models/Review.js");

// we may also add the review poriotn for the delivery parties
const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const userReviews = {
  type: new GraphQLList(ReviewType),
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
    const reviews = await Review.find({ userId: args.userId }).populate(
      "restaurantId"
    ).populate('orderId');
    if (!reviews.length) {
      return []; // Return an empty array instead of a message
    } else {
      return reviews;
    }
  },
};

const restaurantReviews = {
  type: new GraphQLList(ReviewType),
  args: {
    restaurantId: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    const reviews = await Review.find({ restaurantId: args.restaurantId })
    .populate("userId") // Populate user details
    .populate("orderId"); // Populate order details
    if (!reviews.length) {
      return []; // Return an empty array instead of a message
    } else {
      return reviews;
    }
  },
};

const particularOrderReview= {
  type: new GraphQLList(ReviewType),
  args: {
    orderId: {type: new GraphQLNonNull(GraphQLID)}
  },
  async resolve(parent,args){
    const reviews= await Review.find({orderId: args.orderId}).populate("userId").populate("userId");
    if (!reviews.length) {
      return []; // Return an empty array instead of a message
    } else {
      return reviews;
    }
  }
}


module.exports={
    restaurantReviews,
    userReviews,
    particularOrderReview
}
