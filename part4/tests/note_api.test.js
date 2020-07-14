const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { response } = require('express')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// 4.8
test('the blog list application returns the correct amount of blog posts in the JSON format', async () => {
  const response = await api.get('/api/blogs')
  expect(response.header['content-type']).toContain("application/json")
  expect(response.statusCode).toEqual(200)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

// 4.9
test('the unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  expect(blogs[0].id).toBeDefined()
})

// 4.10
test('making an HTTP POST request to the /api/blogs url successfully creates a new blog post', async () => {
  const title = 'Anois, Os Ard: Irish Underground Music For July Reviewed By Eoin Murray'

  const newBlog = {
    title,
    author: "Eoin Murray",
    url: 'https://thequietus.com/articles/28585-murli-interview-irish-music-review',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(title)
})

// 4.11
test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const title = 'likes default to zero'

  const newBlog = {
    title,
    author: "author",
    url: 'url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  const addedBlog = blogsAtEnd.find(n => n.title === title)
  expect(addedBlog).toBeDefined()
  expect(addedBlog.likes).toEqual(0)
})

// 4.12
test('if the title and url properties are missing from the request data the backend responds to the request with the status code 400 Bad Request', async () => {
  const newBlog = {
    author: "author",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
}) 