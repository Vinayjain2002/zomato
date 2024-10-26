const qraphql = require('graphql')
// define al the queries import statement

const { GraphQLObjectType } = graphql

const Query= new GraphQLObjectType({
    name: "Query",
    fields:{

    }
});

module.exports= Query;