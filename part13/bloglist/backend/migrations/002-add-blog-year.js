const { DataTypes } = require('sequelize')

module.exports = {
  up: ({ context: queryInterface }) => queryInterface.addColumn('blogs', 'year', {
    type: DataTypes.INTEGER,
    allowNull: true,
  }),
  down: ({ context: queryInterface }) => queryInterface.removeColumn('blogs', 'year'),
}