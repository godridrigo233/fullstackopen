const request = require('supertest')
const app = require('../app')
const { sequelize, runMigrations } = require('../util/db')
const { User } = require('../models')

const createUser = async (username = 'reader@example.com') => {
  const response = await request(app)
    .post('/api/users')
    .send({ username, name: 'Test User', password: 'password123' })
  expect(response.status).toBe(201)
  return response.body
}

const login = async (username = 'reader@example.com') => {
  const response = await request(app)
    .post('/api/login')
    .send({ username, password: 'password123' })
  expect(response.status).toBe(200)
  return response.body.token
}

beforeAll(async () => {
  await sequelize.authenticate()
  await sequelize.query('DROP SCHEMA public CASCADE')
  await sequelize.query('CREATE SCHEMA public')
  await runMigrations()
})

beforeEach(async () => {
  await sequelize.query('TRUNCATE sessions, reading_lists, blogs, users RESTART IDENTITY CASCADE')
})

afterAll(async () => {
  await sequelize.close()
})

describe('users and authentication', () => {
  test('validates email and updates a user by username with timestamps', async () => {
    const invalid = await request(app)
      .post('/api/users')
      .send({ username: 'not-an-email', name: 'Invalid', password: 'password123' })
    expect(invalid.status).toBe(400)

    const user = await createUser()
    const before = await User.findByPk(user.id)
    const updated = await request(app)
      .put('/api/users/reader@example.com')
      .send({ name: 'Updated User', username: 'updated@example.com' })

    expect(updated.status).toBe(200)
    expect(updated.body.name).toBe('Updated User')
    expect(updated.body.username).toBe('updated@example.com')
    const after = await User.findByPk(user.id)
    expect(after.updatedAt.getTime()).toBeGreaterThanOrEqual(before.updatedAt.getTime())
  })
})

describe('blogs and authors', () => {
  test('creates, searches, orders, aggregates and restricts deletion to the owner', async () => {
    const owner = await createUser('owner@example.com')
    const ownerToken = await login('owner@example.com')
    const other = await createUser('other@example.com')
    const otherToken = await login('other@example.com')

    const first = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'React databases', author: 'Dan Abramov', url: 'https://example.test/a' })
    const second = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Postgres guide', author: 'Dan Abramov', url: 'https://example.test/b', likes: 4, year: 2020 })

    expect(first.status).toBe(201)
    expect(first.body.likes).toBe(0)
    expect(first.body.userId).toBe(owner.id)
    expect(second.status).toBe(201)

    const search = await request(app).get('/api/blogs?search=REACT')
    expect(search.body).toHaveLength(1)
    const ordered = await request(app).get('/api/blogs')
    expect(ordered.body[0].title).toBe('Postgres guide')
    expect(ordered.body[0].user.username).toBe('owner@example.com')

    const updated = await request(app).put(`/api/blogs/${first.body.id}`).send({ likes: 7 })
    expect(updated.body.likes).toBe(7)

    const authors = await request(app).get('/api/authors')
    expect(authors.body).toContainEqual({ author: 'Dan Abramov', articles: '2', likes: '11' })

    const users = await request(app).get('/api/users')
    expect(users.body.find((user) => user.id === owner.id).blogs).toHaveLength(2)

    const forbiddenDelete = await request(app)
      .delete(`/api/blogs/${first.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
    expect(forbiddenDelete.status).toBe(403)

    const deleted = await request(app)
      .delete(`/api/blogs/${first.body.id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
    expect(deleted.status).toBe(204)
  })

  test('rejects invalid publication years', async () => {
    await createUser()
    const token = await login()
    const response = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Too old', url: 'https://example.test', year: 1990 })
    expect(response.status).toBe(400)
  })
})

describe('reading lists and revocable sessions', () => {
  test('filters reading lists, restricts updates and revokes sessions', async () => {
    const reader = await createUser('reader@example.com')
    const token = await login('reader@example.com')
    const other = await createUser('other@example.com')
    const otherToken = await login('other@example.com')
    const blog = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Reading', author: 'Author', url: 'https://example.test/reading' })

    const entry = await request(app)
      .post('/api/readinglists')
      .set('Authorization', `Bearer ${token}`)
      .send({ blogId: blog.body.id, userId: reader.id })
    expect(entry.status).toBe(201)

    const unread = await request(app).get(`/api/users/${reader.id}?read=false`)
    expect(unread.body.readings[0].readinglists).toEqual([{ id: entry.body.id, read: false }])
    const forbidden = await request(app)
      .put(`/api/readinglists/${entry.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ read: true })
    expect(forbidden.status).toBe(403)

    const marked = await request(app)
      .put(`/api/readinglists/${entry.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ read: true })
    expect(marked.body.read).toBe(true)
    const readOnly = await request(app).get(`/api/users/${reader.id}?read=true`)
    expect(readOnly.body.readings).toHaveLength(1)

    await request(app).delete('/api/logout').set('Authorization', `Bearer ${token}`).expect(204)
    await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'After logout', url: 'https://example.test/logout' })
      .expect(401)

    const anotherToken = await login('reader@example.com')
    await User.update({ disabled: true }, { where: { id: reader.id } })
    await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${anotherToken}`)
      .send({ title: 'Disabled', url: 'https://example.test/disabled' })
      .expect(401)
  })
})