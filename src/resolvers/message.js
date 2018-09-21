export default {
  Query: {
    messages: async (_, __, { models }) => await models.Message.findAll(),

    message: async (_, { id }, { models }) => await models.Message.findById(id),
  },

  Mutation: {
    createMessage: async (_, { text }, { models, me }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    },

    deleteMessage: async (_, { id }, { models }) =>
      await models.Message.destroy({ where: { id } }),
  },

  Message: {
    user: async (message, _, { models }) =>
      await models.User.findById(message.userId),
  },
};
