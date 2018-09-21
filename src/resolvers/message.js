export default {
  Query: {
    messages: async (_, __, { models }) => await models.Message.findAll(),

    message: async (_, { id }, { models }) => await models.Message.findById(id),
  },

  Mutation: {
    createMessage: async (_, { text }, { models, me }) =>
      await models.Message.create({
        text,
        userId: me.id,
      }),

    deleteMessage: async (_, { id }, { models }) =>
      await models.Message.destroy({ where: { id } }),
  },

  Message: {
    user: async (message, _, { models }) =>
      await models.User.findById(message.userId),
  },
};
