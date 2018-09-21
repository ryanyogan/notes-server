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
  context: async () => ({
    models,
    me: await models.User.findByLogin('ryanyogan'),
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
