const graphql = require("graphql");
const { menuType } = require("../Type.js");
const Menu = require("../../models/Menu.js");

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList,
  } = graphql;

const findAllItems={
    type: new GraphQLList(menuType),
    args: {
        restaurantId: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(parent, args){
        try{
            const menuItems= await Menu.find({restaurantId: args.restaurantId}).populate('restaurantId');
            return menuItems;
        }catch(err){
            throw new Error("Error while finding Data");
        }
    }
}

const particularItem={
    type: menuType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(parent, args){
        const menuItem= await Menu.findOneById(id).populate('restaurantId');
        return menuItem;
    }
}

const searchItem = {
    type: new GraphQLList(MenuItemType), // Assuming MenuItemType is defined elsewhere
    args: {
        itemname: { type: GraphQLString },
        price: { type: GraphQLFloat }, // For exact match or less than
        category: { type: GraphQLString }, // e.g., "veg" or "non-veg"
        discount: { type: GraphQLInt } // For greater than specified discount
    },
    async resolve(parent, args) {
        const query = {};

        // Add filters to the query based on the provided arguments
        if (args.itemname) {
            query.itemname = { $regex: args.itemname, $options: "i" }; // Case-insensitive regex match for item name
        }
        if (args.price) {
            query.price = { $lte: args.price }; // Less than or equal to specified price
        }
        if (args.category) {
            query.category = { $regex: args.category, $options: "i" }; // Case-insensitive regex match for category
        }
        if (args.discount) {
            query.discount = { $gt: args.discount }; // Greater than specified discount
        }

        try {
            const items = await MenuItem.find(query); // Assuming MenuItem is your Mongoose model
            return items; // Return the found items
        } catch (err) {
            throw new Error("Error while searching for menu items: " + err.message);
        }
    }
};

module.exports={
    findAllItems,
    particularItem,
    searchItem
}