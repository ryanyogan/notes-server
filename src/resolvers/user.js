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

  User: {
    messages: async (user, _, { models }) =>
      await models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
