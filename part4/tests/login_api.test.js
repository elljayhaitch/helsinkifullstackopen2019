const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially one user in the database', () => {
  const username = 'root'
  const password = 'secretsecret'

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, passwordHash })

    await user.save()
  })

  test('login succeeds with the correct login details', async () => {
    const loginRequest = {
      username,
      password,
    }

    await api
      .post('/api/login')
      .send(loginRequest)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login fails with incorrect login details (password)', async () => {
    const loginRequest = {
      username,
      password: 'wrongsecret',
    }

    await api
      .post('/api/login')
      .send(loginRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login fails with incorrect login details (username)', async () => {
    const loginRequest = {
      username: 'wrongUserName',
      password,
    }

    await api
      .post('/api/login')
      .send(loginRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})