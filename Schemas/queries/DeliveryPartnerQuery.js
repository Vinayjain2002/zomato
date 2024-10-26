const graphql = require("graphql");
const { DeliveryPartnerType } = require("../Type.js");
const DeliveryPartner = require("../../models/DeliveryPartner.js");

const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} = graphql;

// Resolver to fetch all delivery partners
const AllDeliveryPartner = {
  type: new GraphQLList(DeliveryPartnerType),
  async resolve(parent, args) {
    try {
      const deliveryPartners = await DeliveryPartner.find({}).populate('userId');
      return deliveryPartners;
    } catch (err) {
      throw new Error("Error while fetching delivery partners: " + err.message);
    }
  },
};

// Resolver to search for delivery partners based on specified criteria
const SearchDeliveryPartner = {
  type: new GraphQLList(DeliveryPartnerType),
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    vehicleNo: { type: new GraphQLNonNull(GraphQLString) }, // Assuming vehicleNo is a string
    rating: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const query = {};

    // Construct the query based on provided arguments
    if (args.name) {
      query.name = { $regex: args.name, $options: "i" }; // Case-insensitive regex for name
    }
    if (args.vehicleNo) {
      query.vehicleNo = args.vehicleNo; // Exact match for vehicle number
    }
    if (args.rating) {
      query.rating = { $gte: args.rating }; // Greater than or equal to specified rating
    }

    try {
      const deliveryPartners = await DeliveryPartner.find(query).populate('userId');
      return deliveryPartners;
    } catch (err) {
      throw new Error("Error while searching for delivery partners: " + err.message);
    }
  },
};

// Resolver to fetch a specific delivery partner by ID
const particularDeliveryPartner = {
  type: DeliveryPartnerType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }, // Required ID argument
  },
  async resolve(parent, args) {
    try {
      const deliveryPartner = await DeliveryPartner.findById(args.id).populate('userId');
      if (!deliveryPartner) {
        throw new Error("Delivery partner not found");
      }
      return deliveryPartner;
    } catch (err) {
      throw new Error("Error while fetching delivery partner: " + err.message);
    }
  },
};

// Exporting the resolvers
module.exports = {
  AllDeliveryPartner,
  SearchDeliveryPartner,
  particularDeliveryPartner,
};
