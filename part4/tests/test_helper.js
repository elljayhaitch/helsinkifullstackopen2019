const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'Nuts',
    author: 'Chris O’Leary',
    url: 'https://bowiesongs.wordpress.com/2020/06/29/nuts/',
    likes: 0
  },
  {
    title: "Stephen Graham Jones's Playlist for His Novel 'The Only Good Indians'", // eslint-disable-line
    author: 'Largehearted Boy',
    url: 'http://www.largeheartedboy.com/blog/archive/2020/07/stephen_graham.html',
    likes: 0
  },
]

const nonExistingBlogId = async () => {
  const blog = new Blog(
    {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 0
    }
  )
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const nonExistingUserId = async () => {
  const passwordHash = await bcrypt.hash('anypass', 10)
  const user = new User({ username: 'anybody', passwordHash })
  await user.save()
  await user.remove()

  return user._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getTokenForUser = async (loginRequest) => {
  const passwordHash = await bcrypt.hash(loginRequest.password, 10)
  const user = new User({ username: loginRequest.username, passwordHash })
  const addedUser = await user.save()

  const response = await api.post('/api/login').send(loginRequest)
  return {
    token: response.body.token,
    userId: addedUser.id
  }
}

module.exports = {
  initialBlogs, nonExistingBlogId, nonExistingUserId, blogsInDb, usersInDb, getTokenForUser
}