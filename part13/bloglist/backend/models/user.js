const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  underscored: true,
  modelName: 'user',
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['passwordHash'] } },
  scopes: { withPassword: { attributes: { include: ['passwordHash'] } } },
})

module.exports = User