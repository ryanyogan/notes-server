import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async ({ id, email, username }, secret, expiresIn) =>
  await jwt.sign({ id, email, username }, secret, {
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
