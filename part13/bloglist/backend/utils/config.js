require('dotenv').config()

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL,
  DATABASE_SSL: process.env.DATABASE_SSL === 'true',
  JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
  PORT: process.env.PORT || 3001,
}