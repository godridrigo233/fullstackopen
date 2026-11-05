const logoutRouter = require('express').Router()
const { Session } = require('../models')
const { userExtractor } = require('../utils/middleware')

logoutRouter.delete('/', userExtractor, async (request, response) => {
  await Session.destroy({ where: { token: request.token } })
  response.status(204).end()
})

module.exports = logoutRouter