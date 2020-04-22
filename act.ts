// import { graphql } from "graphql";
import { makeExecutableSchema, addResolveFunctionsToSchema, IResolverObject } from "graphql-tools";
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    accountingReport: AccountingReport
  }

  type AccountingReport {
    incomeStatement: IncomeStatement
    balanceSheet: BalanceSheet
  }

  type BalanceSheet {
    cost(filter: CostFilter): [Cost]
  }

  input CostFilter {
    product: String
  }

  type Cost {
    product: String
    amount: Float
  }

  type IncomeStatement {
    actualRevene: ActualRevene
  }

  type ActualRevene {
    actuals(filter: ActualRevenueFilter, group: ActualRevenueGroup): [Actuals]
    functional(filter: ActualRevenueFilter, group: ActualRevenueGroup): [Functional]
  }

  input ActualRevenueFilter {
    fiscalYear: Int
    accountingPeriod: Int
  }

  input ActualRevenueGroup {
    fiscalYear: Int
    accountingPeriod: Int
  }

  type Actuals {
    fiscalYear: Int
    accountingPeriod: Int
    supervising: Float
    generating: Float
  }

  type Functional {
    fiscalYear: Int
    accountingPeriod: Int
    supervising: Float
    generating: Float
  }
`;

const accountingReportInstance = {
  incomeStatement: {
    actualRevene: {},
  },
  balanceSheet: {},
};

const resolvers = {
  Query: {
    accountingReport(obj) {
      console.log("accountingReport", obj);
      return accountingReportInstance;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});

const ActualRevene: IResolverObject = {
  actuals(obj, args, ctx) {
    console.log("actuals", obj);
    return [
      {
        fiscalYear: 2018,
        accountingPeriod: 3,
        supervising: 3000,
        generating: 3000,
      },
      {
        fiscalYear: 2018,
        accountingPeriod: 4,
        supervising: 2000,
        generating: 4000,
      },
    ];
  },
  functional(obj, args, ctx) {
    console.log("functional", obj);
    return [
      {
        fiscalYear: 2018,
        accountingPeriod: 3,
        supervising: 3000,
        generating: 6000,
      },
    ];
  },
};

const BalanceSheet: IResolverObject = {
  cost(obj, args, ctx) {
    console.log("cost", obj);
    return [
      {
        product: "product-1",
        amount: 1000,
      },
      {
        product: "product-2",
        amount: 2000,
      },
    ];
  },
};

addResolveFunctionsToSchema({
  schema,
  resolvers: {
    BalanceSheet,
    ActualRevene,
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
