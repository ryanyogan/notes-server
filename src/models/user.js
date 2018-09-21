import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 24],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models =>
    User.hasMany(models.Message, { onDelete: 'CASCADE' });

  User.beforeCreate(async createdUser => {
    createdUser.password = await createdUser.generatePasswordHash(); // eslint-disable-line
  });

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

  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
