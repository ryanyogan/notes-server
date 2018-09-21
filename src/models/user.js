const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models =>
    User.hasMany(models.Message, { onDelete: 'CASCADE' });

  User.findByLogin = async login => {
    let me = await User.findOne({
      where: { username: login },
    });

    if (!me) {
      me = await User.findOne({
        where: { email: login },
      });
    }

    return me;
  };

  return User;
};

export default user;
