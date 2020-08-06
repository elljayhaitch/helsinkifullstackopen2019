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

  const passwordHash = await bcrypt.hash(body.password, 10)

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

usersRouter.get('/:id', async (request, response) => {
  let user
  try {
    user = await User.findById(request.params.id)
  }
  catch (error) {
    return response.status(400).json({ error: `${error}` }).end()
  }

  if (user) {
    return response.json(user).end()
  } else {
    response.status(404).end()
  }
})

usersRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (!user) {
    return response.status(404).json({ error: 'could not find user' }).end()
  }

  // at the moment, not deleting their blogs. should we? so that blogs aren't left behing with null users
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  let user = await User.findById(request.params.id)
  if (!user) {
    return response.status(404).end()
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, { name: request.body.name }, { new: true, runValidators: true })
  response.json(updatedUser)
})

module.exports = usersRouter