const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { Blog, ReadingList, User } = require('../models')

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: [{ model: Blog, as: 'blogs', attributes: ['id', 'title', 'author', 'url', 'likes', 'year'] }],
    order: [['id', 'ASC']],
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, name, passwordHash })
  response.status(201).json({ id: user.id, username: user.username, name: user.name })
})

usersRouter.put('/:username', async (request, response) => {
  const user = await User.findOne({ where: { username: request.params.username } })
  if (!user) return response.sendStatus(404)
  if (request.body.name !== undefined) user.name = request.body.name
  if (request.body.username !== undefined) user.username = request.body.username
  await user.save()
  response.json({ id: user.id, username: user.username, name: user.name })
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id)
  if (!user) return response.sendStatus(404)

  const where = { userId: user.id }
  if (request.query.read === 'true') where.read = true
  if (request.query.read === 'false') where.read = false

  const listEntries = await ReadingList.findAll({
    where,
    include: [{ model: Blog, as: 'blog' }],
    order: [['id', 'ASC']],
  })
  const readings = listEntries.map((entry) => ({
    ...entry.blog.toJSON(),
    readinglists: [{ id: entry.id, read: entry.read }],
  }))

  response.json({ id: user.id, name: user.name, username: user.username, readings })
})

module.exports = usersRouter