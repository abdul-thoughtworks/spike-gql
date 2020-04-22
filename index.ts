// import { graphql } from "graphql";
import { makeExecutableSchema, addResolveFunctionsToSchema, IResolverObject } from "graphql-tools";
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    person: User
  }

  type User {
    id: ID
    name: String
    dog(showCollar: Boolean): Dog
  }

  type Dog {
    name: String
    collar: [Collar]
    food(season: String): String
  }

  type Collar {
    color: String
    style: String
    bell: [Bell]
  }

  type Bell {
    size: String
    sound: String
  }
`;

const resolvers = {
  Query: {
    person(obj) {
      console.log("Person Arg 1", obj);
      return {
        id: "foo",
        name: "bar",
      };
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});

const User: IResolverObject = {
  dog(obj, args, ctx) {
    console.log("Dog Arg 1", obj);
    return {
      name: "doggy",
    };
  },
};

const Dog: IResolverObject = {
  collar(obj, args, ctx) {
    console.log("Collar Arg 1", obj);
    return [
      {
        color: "red",
        style: "classic",
      },
      {
        color: "black",
        style: "modern",
      },
    ];
  },
  food(obj, args, ctx) {
    console.log("Food args", args);
    return "Pedigree";
  },
};

const Collar: IResolverObject = {
  bell(obj, args, ctx) {
    console.log("Bell Arg 1", obj);
    return [
      {
        sound: "ding",
        size: "medium",
      },
      {
        sound: "dong",
        size: "small",
      },
    ];
  },
};

addResolveFunctionsToSchema({
  schema,
  resolvers: {
    User,
    Dog,
    Collar,
  },
});

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  context: ({ req, res }) => ({
    headers: req.headers,
    req,
    res,
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

// const query = `{
//   person {
//     name,
//     dog(showCollar: true) {
//       name
//     }
//   }
//  }`;

// graphql(schema, query).then((result) => {
//   console.log(JSON.stringify(result, null, 2));
// });

// Person Arg 1 undefined
// Dog Arg 1 { id: 'foo', name: 'bar' }
// {
//   "data": {
//     "person": {
//       "name": "bar",
//       "dog": {
//         "name": "doggy"
//       }
//     }
//   }
// }
// {
