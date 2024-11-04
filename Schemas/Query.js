const qraphql = require('graphql')
const { GraphQLObjectType } = graphql
import { AllDeliveryPartner,SearchDeliveryPartner,particularDeliveryPartner} from './queries/DeliveryPartnerQuery.js'
import { findAllItems,particularItem,searchItem} from './queries/MenuQuery.js'
import { findRestaurantByOwner,searchRestaurant, particularRestaurant, fetchAllRestaurants} from './queries/RestaurantQuery.js'
import {restaurantReviews,userReviews,particularOrderReview} from './queries/ReviewQuery.js'
import {  login, getUserDetail,getAllUsers, getAllDeliveryPartner,getAllRestaurnatOwner,getAllAdmin} from './queries/UserQuery.js'

const Query= new GraphQLObjectType({
    name: "Query",
    fields:{
        AllDeliveryPartner,
        SearchDeliveryPartner,
        particularDeliveryPartner,
        findAllItems,
        particularItem,
        searchItem,
        fetchUserAllOrders,
        fetchOrderwithRestaurant,
        searchOrder,
        particularOrder,
        findRestaurantByOwner,
        searchRestaurant,
        particularRestaurant,
        fetchAllRestaurants,
        restaurantReviews,
    userReviews,
    particularOrderReview,  login,
    getUserDetail,
    getAllUsers,
    getAllDeliveryPartner,
    getAllRestaurnatOwner,
    getAllAdmin
    }
});

module.exports= Query;