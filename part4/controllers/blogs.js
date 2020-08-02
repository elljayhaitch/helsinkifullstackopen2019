const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  let decodedToken
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: `${error}` })
  }

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (body.title === undefined && body.url === undefined) {
    return response.status(400).end()
    // TODO LH return
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

blogsRouter.get('/:id', async (request, response, next) => {
  let blog
  try {
    blog = await Blog.findById(request.params.id)
  }
  catch (error) {
    return response.status(400).json({ error: `${error}` }).end()
  }

  if (blog) {
    return response.json(blog).end()
    // TODO LH return
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }).end()
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'could not find blog' }).end()
  }

  // TODO LH add a test for this
  if (!blog.user || blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(400).json({ error: 'users can only delete their own blogs' }).end()
  }
  // TODO delete the blog from the user
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  // only allowing update of likes value
  let blog = await Blog.findById(request.params.id)
  if (blog) {
    if (request.body.likes !== undefined && request.body.likes > 0) {
      blog.likes = request.body.likes
      Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
      return response.json(blog).end()
      // TODO LH return
    }

    // no update
    return response.json(blog).end()
    // TODO LH return
  } else {
    // not found
    response.status(404).end()
  }
})

module.exports = blogsRouter