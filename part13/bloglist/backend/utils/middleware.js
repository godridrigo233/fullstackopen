const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { Session, User } = require('../models')

const unauthorized = (message = 'token missing or invalid') => {
  const error = new Error(message)
  error.status = 401
  return error
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw unauthorized()
  }

  const token = authorization.slice(7)
  let decodedToken
  try {
    decodedToken = jwt.verify(token, JWT_SECRET)
  } catch {
    throw unauthorized('token invalid')
  }

  const [session, user] = await Promise.all([
    Session.findByPk(token),
    User.findByPk(decodedToken.id),
  ])

  if (!session || !user || user.disabled) {
    throw unauthorized('session is no longer active')
  }

  request.token = token
  request.user = user
  next()
}

const unknownEndpoint = (request, response) => response.status(404).json({ error: 'unknown endpoint' })

const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error)

  if (error.status) return response.status(error.status).json({ error: error.message })

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors.map((item) => item.message) })
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.errors.map((item) => item.message) })
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(400).json({ error: 'referenced record does not exist' })
  }

  console.error(error)
  return response.status(500).json({ error: 'internal server error' })
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  userExtractor
}