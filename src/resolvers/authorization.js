import { ForbiddenError } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not an authenticated user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_, __, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized for that action.'),
);

export const isMessageOwner = async (_, { id }, { models, me }) => {
  const message = await models.Message.findById(id, { raw: true });

  if (message.userId !== me.id) {
    return new ForbiddenError('Not an authenticated owner.');
  }

  return skip;
};
