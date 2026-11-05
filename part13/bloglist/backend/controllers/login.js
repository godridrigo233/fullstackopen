const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { JWT_SECRET } = require('../utils/config')
const { Session, User } = require('../models')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.unscoped().findOne({ where: { username } })
  const passwordCorrect = user && !user.disabled
    ? await bcrypt.compare(password, user.passwordHash)
    : false

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '30d' })
  await Session.create({ token, userId: user.id })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter