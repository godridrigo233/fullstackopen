const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class ReadingList extends Model {}

ReadingList.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  blogId: { type: DataTypes.INTEGER, allowNull: false, field: 'blog_id' },
}, {
  sequelize,
  underscored: true,
  modelName: 'readingList',
  tableName: 'reading_lists',
  indexes: [{ unique: true, fields: ['user_id', 'blog_id'] }],
})

module.exports = ReadingList