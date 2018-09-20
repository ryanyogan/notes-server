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
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Some Dude',
    messageIds: [2],
  },
};

const messages = {
  1: {
    id: '1',
    text: 'This is message 1',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'This is message 2',
    userId: '2',
  },
};

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    me: (_, __, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),

    messages: () => Object.values(messages),
    message: (_, { id }) => messages[id],
  },

  Message: {
    user: message => users[message.userId],
  },

  User: {
    messages: user =>
      Object.values(messages).filter(message => message.userId === user.id),
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
