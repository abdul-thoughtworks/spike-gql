import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import { Request, Response } from "express";
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!"
  }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: ({ req, res }) => ({
        headers: req.headers,
        req,
        res,
    }),
});

export function handler(req: Request, res: Response) {
  //auth here
  const appolloHandler = server.createHandler();
  appolloHandler(req, res);
}
