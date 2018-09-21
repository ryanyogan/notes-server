import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin } from './authorization';

const createToken = async ({ id, email, username, role }, secret, expiresIn) =>
  await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });

export default {
  Query: {
    me: async (_, __, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findbyId(me.id);
    },
    user: async (_, { id }, { models }) => await models.User.findById(id),
    users: async (_, __, { models }) => await models.User.findAll(),
  },

  Mutation: {
    signUp: async (_, { username, email, password }, { models, secret }) => {
      try {
        const user = await models.User.create({
          username,
          email,
          password,
        });
        return { token: createToken(user, secret, '30m') };
      } catch (error) {
        throw new Error(error);
      }
    },

    signIn: async (_, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with provided login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid Password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    deleteUser: combineResolvers(
      isAdmin,
      async (_, { id }, { models }) =>
        await models.User.destroy({
          where: { id },
        }),
    ),
  },

  User: {
    messages: async (user, _, { models }) =>
      await models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
