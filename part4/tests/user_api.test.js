const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secretsecret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('GET all users', () => {
  test('returns the expected amount of users in JSON format', async () => {
    const response = await api.get('/api/users')
    expect(response.header['content-type']).toContain('application/json')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)

    expect(response.body[0].password).toEqual(undefined)
    expect(response.body[0].passwordHash).toEqual(undefined)
  })
})

describe('GET a user by id', () => {
  test('succeeds with a valid id', async () => {
    const users = await helper.usersInDb()
    const user = users[0]

    const response = await api
      .get(`/api/users/${user.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toEqual(user.username)
    expect(response.body.name).toEqual(user.name)
    expect(response.body.password).toEqual(undefined)
    expect(response.body.passwordHash).toEqual(undefined)
  })

  test('fails if user does not exist', async () => {
    const validNonexistingId = await helper.nonExistingUserId()
    await api
      .get(`/api/users/${validNonexistingId}`)
      .expect(404)
  })

  test('fails if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api
      .get(`/api/users/${invalidId}`)
      .expect(400)
  })
})

describe('POST to create a new user', () => {
  test('succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'dbyrne',
      name: 'David Byrne',
      password: 'sense',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: usersAtStart[0].username,
      name: 'James Murphy',
      password: 'hits',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode and message if username missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'James Murphy',
      password: 'hits',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode and message if password missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username-but-password-missing',
      name: 'James Murphy',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode and message if username less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'James Murphy',
      password: 'hits',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` (`us`) is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode and message if password less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username-but-password-too-short',
      name: 'James Murphy',
      password: 'p',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('DELETE a user', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToDelete = usersAtStart[0]

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(
      usersAtStart.length - 1
    )

    const names = usersAtEnd.map(u => u.name)
    expect(names).not.toContain(userToDelete.name)
  })

  test('fails if user does not exist', async () => {
    const validNonexistingId = await helper.nonExistingUserId()
    await api
      .delete(`/api/users/${validNonexistingId}`)
      .expect(404)
  })
})

describe('PUT to update an existing user', () => {
  test('only updates name', async () => {
    const existingUsers = await helper.usersInDb()
    const existingUser = existingUsers[0]
    const existingUsername = existingUser.username

    const updatedName = 'abby'
    existingUser.name = updatedName

    existingUser.username = 'abby-user'
    existingUser.password = 'my-new-password'

    await api
      .put(`/api/users/${existingUser.id}`)
      .send(existingUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedUsers = await helper.usersInDb()
    const updatedUser = updatedUsers[0]

    expect(updatedUser.name).toEqual(updatedName)
    expect(updatedUser.username).toEqual(existingUsername)
    expect(updatedUser.password).toEqual(undefined)
  })

  test('fails if user does not exist', async () => {
    const validNonexistingId = await helper.nonExistingUserId()

    const existingUsers = await helper.usersInDb()
    const existingUser = existingUsers[0]

    await api
      .put(`/api/users/${validNonexistingId}`)
      .send(existingUser)
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})