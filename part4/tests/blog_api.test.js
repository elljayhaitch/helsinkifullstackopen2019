const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const tokenForInitialUser = await helper.getTokenForInitialUser()
  token = tokenForInitialUser.token

  const blogObjects = helper.initialBlogs.map(blog => {
    blog.user = tokenForInitialUser.userId
    return new Blog(blog)
  })
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

describe('GET all blogs', () => {
  test('returns the expected amount of blogs in JSON format', async () => {
    const response = await api.get('/api/blogs')
    expect(response.header['content-type']).toContain('application/json')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returns blogs with a unique identifier property named id', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })

  test('returns blogs containing an expected blog', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(helper.initialBlogs[0].title)
  })
})

describe('GET a blog by id', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.author).toEqual(blogToView.author)
    expect(resultBlog.body.id).toEqual(blogToView.id)
    expect(resultBlog.body.likes).toEqual(blogToView.likes)
    expect(resultBlog.body.title).toEqual(blogToView.title)
    expect(resultBlog.body.url).toEqual(blogToView.url)
    expect(resultBlog.body.user.toString()).toEqual(blogToView.user.toString())
  })

  test('fails if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('POST to create a new blog', () => {
  test('succeeds with valid data', async () => {
    const title = 'Anois, Os Ard: Irish Underground Music For July Reviewed By Eoin Murray'

    const newBlog = {
      title,
      author: 'Eoin Murray',
      url: 'https://thequietus.com/articles/28585-murli-interview-irish-music-review',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(title)
  })

  test('will set likes to default value 0 if likes property is missing', async () => {
    const title = 'new'

    const newBlog = {
      title,
      author: 'author',
      url: 'url',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd.find(n => n.title === title)
    expect(addedBlog).toBeDefined()
    expect(addedBlog.likes).toEqual(0)
  })

  test('will set likes to default value 0 if likes property is less than 0', async () => {
    const title = 'new'

    const newBlog = {
      title,
      author: 'author',
      url: 'url',
      likes: -7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd.find(n => n.title === title)
    expect(addedBlog).toBeDefined()
    expect(addedBlog.likes).toEqual(0)
  })

  test('fails if the title and url properties are missing', async () => {
    const newBlog = {
      author: 'author',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails if a token is not provided', async () => {
    const newBlog = {
      author: 'author',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('DELETE a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('PUT to update an existing blog', () => {
  test('succeeds with valid likes value', async () => {
    let existingBlogs = await helper.blogsInDb()
    let existingBlog = existingBlogs[0]

    const updatedLikes = existingBlog.likes++
    existingBlog.likes = updatedLikes

    await api
      .put(`/api/blogs/${existingBlog.id}`)
      .send(existingBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    existingBlogs = await helper.blogsInDb()
    existingBlog = existingBlogs[0]

    expect(existingBlog.likes).toEqual(updatedLikes)
  })

  test('will make no update but return existing blog if new likes value is less than 0', async () => {
    let existingBlogs = await helper.blogsInDb()
    let existingBlog = existingBlogs[0]
    const existingLikes = existingBlog.likes

    existingBlog.likes = -1

    await api
      .put(`/api/blogs/${existingBlog.id}`)
      .send(existingBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    existingBlogs = await helper.blogsInDb()
    existingBlog = existingBlogs[0]

    expect(existingBlog.likes).toEqual(existingLikes)
  })

  test('will make no update but return existing blog if new likes property is missing', async () => {
    let existingBlogs = await helper.blogsInDb()
    let existingBlog = existingBlogs[0]
    const existingLikes = existingBlog.likes

    existingBlog.likes = undefined

    await api
      .put(`/api/blogs/${existingBlog.id}`)
      .send(existingBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    existingBlogs = await helper.blogsInDb()
    existingBlog = existingBlogs[0]

    expect(existingBlog.likes).toEqual(existingLikes)
  })

  test('fails if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    const existingBlogs = await helper.blogsInDb()
    const existingBlog = existingBlogs[0]

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(existingBlog)
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
}) 