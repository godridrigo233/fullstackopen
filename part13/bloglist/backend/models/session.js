const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  token: { type: DataTypes.STRING(512), primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
}, {
  sequelize,
  underscored: true,
  modelName: 'session',
  tableName: 'sessions',
})

module.exports = Session