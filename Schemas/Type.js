const graphql = require("graphql");
const GraphQLDate = require("graphql-date");
const User = require("../models/userModel.js");
const Restaurat = require("../models/Restaurants.js");
const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");
const { GraphQLObjectType } = require("graphql");
const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = graphql;

const addressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    tag: { type: GraphQLString },
    houseNo: { type: new GraphQLNonNull(GraphQLString) },
    streetNo: { type: GraphQLString },
    location: { type: GraphQLString },
    pincode: { type: GraphQLString },
  }),
});

const roleEnumType = new GraphQLEnumType({
  name: "RoleEnum",
  values: {
    USER: { value: "user" },
    RESTAURANT_OWNER: { value: "restaurant_owner" },
    DELIVERY_AGENT: { value: "delivery_agent" },
    ADMIN: { value: "admin" },
  },
});

const orderStatusType = new GraphQLObjectType({
  name: "OrderStatus",
  values: {
    PENDING: { value: "pending" },
    ACCEPTED: { value: "accepted" },
    DELIVERED: { value: "delivered" },
    CANCELLED: { value: "cancelled" },
  },
});

const paymentStatusType = new GraphQLObjectType({
  name: "PaymentStatus",
  values: {
    PAID: { value: "paid" },
    NOT_PAID: { value: "notpaid" },
  },
});

const menuCategoryType = new GraphQLInputObjectType({
  name: "menuCategory",
  values: {
    VEG: "veg",
    NON_VEG: "non-veg",
  },
});

//auth Model
const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    id: { type: GraphQLID },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    accesstokenExp: { type: GraphQLString },
    refreshtokenExp: { type: GraphQLString },
  }),
});

// user Model
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    mobileNo: { type: new GraphQLNonNull(GraphQLInt) },
    image: { type: GraphQLString },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    accessTokenExp: { type: GraphQLDate },
    refreshTokenExp: { type: GraphQLDate },
    role: { type: roleEnumType },
    address: { type: new GraphQLList(addressType) },
  }),
});

// review Model
const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: new GraphQLNonNull(GraphQLID) }, // Reference to User type
    restaurantId: { type: new GraphQLNonNull(GraphQLID) }, // Reference to Restaurant type
    orderId: {type: GraphQLID},
    rating: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Rating must be between 1 and 5",
    },
    comment: { type: GraphQLString, defaultValue: "Good" },
  }),
});

// restaurant model
const RestaurantType = new GraphQLObjectType({
  name: "Restaurant",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLList(addressType) },
    phoneNo: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) }, // List of non-null strings
    cuisine: { type: GraphQLString },
    rating: {
      type: GraphQLInt,
      description: "Average rating between 1 and 5",
    },
    ownerId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

// order Model
const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    userId: { type: new GraphQLNonNull(GraphQLID) },
    restaurantId: { type: new GraphQLNonNull(GraphQLID) },
    deliveryPrtner: { type: new GraphQLNonNull(GraphQLID) },
    orderDate: { type: GraphQLDate },
    totalAmount: { type: new GraphQLNonNull(GraphQLInt) },
    timeTaken: { type: new GraphQLNonNull(GraphQLInt) },
    status: { type: orderStatusType },
    paymenrStatus: { type: paymentStatusType },
  }),
});

// menu Model
const menuType = new GraphQLInputObjectType({
  name: "Menu",
  fields: () => ({
    id: { type: GraphQLID },
    itemname: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLString() },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    category: { type: menuCategoryType },
    discount: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
  }),
});

const DeliveryPartnerType= new GraphQLInputObjectType({
  name: "DeliveryPartner",
  fields: ()=>(
    {
      name: {type: new GraphQLNonNull(GraphQLString)},
      userId: {type: new GraphQLNonNull(GraphQLID)},
      vehicleNumber: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      photo: {
        type: new GraphQLNonNull(GraphQLString)
      },
      rating: {
        type: GraphQLInt
      }
    }
  )
})

module.exports = {
  AuthType,
  UserType,
  menuType,
  OrderType,
  RestaurantType,
  ReviewType,
  DeliveryPartnerType
};
