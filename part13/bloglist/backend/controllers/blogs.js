const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const search = request.query.search
  const where = search
    ? { [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }, { author: { [Op.iLike]: `%${search}%` } }] }
    : undefined
  const blogs = await Blog.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }],
    order: [['likes', 'DESC'], ['id', 'ASC']],
  })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, year } = request.body
  const blog = await Blog.create({
    title,
    author,
    url,
    likes: likes ?? 0,
    year: year ?? null,
    userId: request.user.id,
  })
  response.status(201).json(blog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (!blog) return response.sendStatus(404)
  if (blog.userId !== request.user.id) return response.status(403).json({ error: 'only the creator can delete this blog' })
  await blog.destroy()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (!blog) return response.sendStatus(404)
  if (request.body.likes !== undefined) blog.likes = request.body.likes
  if (request.body.title !== undefined) blog.title = request.body.title
  if (request.body.author !== undefined) blog.author = request.body.author
  if (request.body.url !== undefined) blog.url = request.body.url
  if (request.body.year !== undefined) blog.year = request.body.year
  await blog.save()
  response.json(blog)
})

module.exports = blogsRouter