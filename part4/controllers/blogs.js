const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' }).end()
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: `${error}` }).end()
  }

  const user = await User.findById(decodedToken.id)

  const body = request.body

  if (body.title === undefined && body.url === undefined) {
    return response.status(400).end()
  }
  if (body.likes === undefined || body.likes < 0) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  let blog
  try {
    blog = await Blog.findById(request.params.id)
  }
  catch (error) {
    return response.status(400).json({ error: `${error}` }).end()
  }

  if (blog) {
    return response.json(blog).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' }).end()
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: `${error}` }).end()
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'could not find blog' }).end()
  }

  if (!blog.user || !decodedToken.id || blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(400).json({ error: 'users can only delete their own blogs' }).end()
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const body = request.body
  if (body.likes === undefined || body.likes < 0) {
    return response.json(blog).end()
  }

  blog.likes = body.likes
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter