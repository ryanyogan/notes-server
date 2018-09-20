import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

const users = {
  1: {
    id: '1',
    username: 'Ryan Yogan',
  },
  2: {
    id: '2',
    username: 'Some Dude',
  },
};

const me = users[1];

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: (_, __, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
  },

  User: {
    username: parent => parent.username,
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Server is listening on port :8000/graphql'); // eslint-disable-line
});
