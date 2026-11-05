const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  author: { type: DataTypes.STRING },
  url: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
  title: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
  likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1991, max: new Date().getFullYear() },
  },
  userId: { type: DataTypes.INTEGER, allowNull: true, field: 'user_id' },
}, {
  sequelize,
  underscored: true,
  modelName: 'blog',
  tableName: 'blogs',
})

module.exports = Blog