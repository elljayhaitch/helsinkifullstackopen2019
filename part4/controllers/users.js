const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined) {
    return response
      .status(400)
      .send({ error: 'User validation failed: password: Path `password` is required.' })
      .end()
  }

  if (body.password.length < 3) {
    return response
      .status(400)
      .send({ error: 'User validation failed: password: Path `password` is shorter than the minimum allowed length (3).' })
      .end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  let savedUser
  try {
    savedUser = await user.save()
  } catch (error) {
    return response
      .status(400)
      .send({ error: `${error}` })
      .end()
  }

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',
    { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  const user = await User.findById(request.params.id)

  if (user) {
    return response.json(user).end()
  } else {
    response.status(404).end()
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  let user = await User.findById(request.params.id)
  if (user) {
    user.username = request.body.username
    user.name = request.body.name
    // not updating password
    User.findByIdAndUpdate(request.params.id, user, { new: true, runValidators: true })
    return response.json(user).end()
  } else {
    // not found
    response.status(404).end()
  }
})

module.exports = usersRouter