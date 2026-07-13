const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('cuando hay inicialmente algunos blogs guardados', () => {
  
  test('los blogs se devuelven como json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('se devuelven todos los blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('la propiedad identificadora única de los blogs se llama id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).toBeUndefined()
  })
})

describe('adición de un nuevo blog', () => {

  test('un blog válido se puede agregar correctamente', async () => {
    const newBlog = {
      title: 'Async/Await es genial',
      author: 'Rodrigo',
      url: 'https://fullstackopen.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Async/Await es genial')
  })
  test('si la propiedad likes falta en la solicitud, por defecto será 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog sin likes',
      author: 'Test Author',
      url: 'https://example.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })
  test('si falta el título o la url, el servidor responde con 400 Bad Request', async () => {
    const badBlog = {
      author: 'Anonymous',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(badBlog)
      .expect(400)
  })
})

describe('eliminación de un blog', () => {
  
  test('un blog se puede eliminar correctamente si el ID es válido', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('actualización de un blog', () => {

  test('se pueden actualizar los likes de un blog existente', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    expect(response.body.likes).toBe(blogToUpdate.likes + 10)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})