const graphql = require("graphql");
const { RestaurantType } = require("../Type.js");
const Restaurant = require("../../models/Restaurants.js");
const Review = require("../../models/Review.js");

const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

const fetchAllRestaurants = {
  type: new GraphQLList(RestaurantType),
  async resolve(parent, args, req) {
    try {
      const restaurants = await Restaurant.find({}).populate("ownerId");
      return restaurants;
    } catch (err) {
      throw new Error("Error while finding Data");
    }
  },
};

const particularRestaurant = {
  type: new GraphQLList(RestaurantType),
  args: {
    id: new GraphQLNonNull(GraphQLID),
  },
  async resolve(parent, args, req) {
    try {
      let restaurant = await Restaurant.findOneById(args.id).populate(
        "ownerId"
      ); // Pass args.id
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
      const reviews = await Review.find({ restaurantId: restaurant._id }); // Use restaurant._id
      return {
        restaurant,
        reviews,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};

const searchRestaurant = {
  type: new GraphQLList(RestaurantType),
  args: {
    name: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    rating: { type: GraphQLInt }, // For greater than rating
    pincode: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const query = {};
    if (args.name) {
      query.name = { $regex: args.name, $options: "i" }; // Case insensitive regex for name
    }
    if (args.cuisine) {
      query.cuisine = { $regex: args.cuisine, $options: "i" }; // Case insensitive regex for cuisine
    }
    if (args.rating) {
      query.rating = { $gt: args.rating }; // Greater than specified rating
    }
    if (args.pincode) {
      query["address.pincode"] = args.pincode; // Filter by pincode
    }
    try {
      const restaurants = await Restaurant.find(query).populate("ownerId"); // Fetch restaurants based on the constructed query
      return restaurants;
    } catch (err) {
      throw new Error("Error while searching for restaurants: " + err.message);
    }
  },
};

const findRestaurantByOwner = {
    type: new GraphQLList(RestaurantType),
    args: {
      ownerId: { type: GraphQLID },
    },
    async resolve(parent, args, { req }) {
      try {
        // Fetch restaurants based on the owner's ID
        const restaurants = await Restaurant.find({ ownerId: args.ownerId }).populate("ownerId");
        return restaurants;
      } catch (err) {
        throw new Error("Error while fetching restaurants: " + err.message);
      }
    },
  };
  

module.exports={
    findRestaurantByOwner,
    searchRestaurant,
    particularRestaurant,
    fetchAllRestaurants
}
