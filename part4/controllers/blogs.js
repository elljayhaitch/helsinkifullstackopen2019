const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === undefined && request.body.url === undefined) {
    response.status(400).end()
    return
  }
  if (request.body.likes === undefined || request.body.likes < 0) {
    request.body.likes = 0;
  }

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result).end()
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog).end()
    return
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  // only allowing update of likes value
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if (request.body.likes === undefined || request.body.likes < 0) {
      blog.likes = request.body.likes;
      Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
      response.json(blog).end()
      return
    }

    // no update
    response.json(blog).end()
    return
  } else {
    // not found
    response.status(404).end()
  }
})

module.exports = blogsRouter