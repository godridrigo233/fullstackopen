const readingListsRouter = require('express').Router()
const { Blog, ReadingList } = require('../models')
const { userExtractor } = require('../utils/middleware')

readingListsRouter.post('/', userExtractor, async (request, response) => {
  const { blogId, userId } = request.body
  if (userId !== undefined && Number(userId) !== request.user.id) {
    return response.status(403).json({ error: 'a user can only edit their own reading list' })
  }
  const blog = await Blog.findByPk(blogId)
  if (!blog) return response.sendStatus(404)

  const entry = await ReadingList.create({ userId: request.user.id, blogId: blog.id, read: false })
  response.status(201).json(entry)
})

readingListsRouter.put('/:id', userExtractor, async (request, response) => {
  const entry = await ReadingList.findByPk(request.params.id)
  if (!entry) return response.sendStatus(404)
  if (entry.userId !== request.user.id) return response.status(403).json({ error: 'a user can only edit their own reading list' })
  if (typeof request.body.read !== 'boolean') {
    return response.status(400).json({ error: 'read must be a boolean' })
  }
  entry.read = request.body.read
  await entry.save()
  response.json(entry)
})

module.exports = readingListsRouter