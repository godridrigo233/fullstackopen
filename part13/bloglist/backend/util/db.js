const path = require('path')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const config = require('../utils/config')

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: config.DATABASE_SSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
})

const migrator = new Umzug({
  migrations: { glob: path.join(__dirname, '../migrations/*.js') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
})

const runMigrations = () => migrator.up()

const connectToDatabase = async () => {
  await sequelize.authenticate()
  await runMigrations()
}

module.exports = { sequelize, connectToDatabase, runMigrations }