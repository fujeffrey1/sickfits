const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const path = require('path');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

function createServer() {
    return new ApolloServer({
        typeDefs: importSchema(path.resolve('src/schema.graphql')),
        resolvers: {
            Mutation,
            Query,
            Node: {
                __resolveType() {
                    return null;
                }
            }
        },
        context: ({ req, res }) => ({ req, res, db })
    });
}

module.exports = createServer;
