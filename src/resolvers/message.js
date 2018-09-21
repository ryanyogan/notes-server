import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: (_, __, { models }) => Object.values(models.messages),

    message: (_, { id }, { models }) => models.messages[id],
  },

  Mutation: {
    createMessage: (_, { text }, { me }, { models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      models.messages[id] = message; // eslint-disable-line
      models.users[me.id].messageIds.push(id);
    },

    deleteMessage: (_, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages; // eslint-disable-line

      return true;
    },
  },

  Message: {
    user: (message, _, { models }) => models.users[message.userId],
  },
};
