import React, { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'

const LoginForm = (props) => {
  const { setUser, setNotification, message, errorMessage } = props

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    loginService.login({
      username, password,
    })
      .then(user => {
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      })
      .catch(error => setNotification(`Incorrect username or password, ${error}`, true))
  }

  return (
    <div>
      <h2>log in to application</h2>

      <Notification message={message} notificationClass="notification" />
      <Notification message={errorMessage} notificationClass="error" />

      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

    </div>
  )
}

export default LoginForm