const authorsRouter = require('express').Router()
const { QueryTypes } = require('sequelize')
const { sequelize } = require('../util/db')

authorsRouter.get('/', async (request, response) => {
  const authors = await sequelize.query(
    `SELECT author, COUNT(*) AS articles, COALESCE(SUM(likes), 0) AS likes
     FROM blogs
     WHERE author IS NOT NULL
     GROUP BY author
     ORDER BY author`,
    { type: QueryTypes.SELECT },
  )
  response.json(authors)
})

module.exports = authorsRouter