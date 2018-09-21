import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async () => ({
    models,
    me: await models.User.findByLogin('ryanyogan'),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    console.log('Server is listening on port :8000/graphql'); // eslint-disable-line
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'ryanyogan',
      email: 'ryan@ryan.com',
      password: 'password',
      messages: [
        {
          text: 'This is the first message from Ryan',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'johndoe',
      email: 'john@doe.com',
      password: 'password',
      messages: [
        {
          text: 'This is the first message from John',
        },
        {
          text: 'This is the second message from John',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
