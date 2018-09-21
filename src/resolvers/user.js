export default {
  Query: {
    me: (_, __, { me }) => me,
    user: (_, { id }, { models }) => models.users[id],
    users: (_, __, { models }) => Object.values(models.users),
  },

  User: {
    messages: (user, _, { models }) =>
      Object.values(models.messages).filter(
        message => message.userId === user.id,
      ),
  },
};
