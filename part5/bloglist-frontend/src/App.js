import React, { useState, useEffect } from 'react'
import './App.css'

import blogService from './services/blogs'
import loginService from './services/login'

import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const setNotification = (notification, error) => {
    if (error) {
      setErrorMessage(notification)
      setTimeout(() => setErrorMessage(null), 5000)
    } else {
      setMessage(notification)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    loginService.login({
      username, password,
    })
      .then(user => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      })
      .catch(error => setNotification(`Incorrect username or password, ${error}`, true))
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          handleSubmit={handleLogin}
          message={message}
          errorMessage={errorMessage}
          username={username}
          password={password}
          setUsername={event => setUsername(event.target.value)}
          setPassword={event => setPassword(event.target.value)}
        />
      </Togglable>)
  }

  return (
    <div>
      {user === null ?
        loginForm() :
        <BlogList
          setUser={setUser}
          setNotification={setNotification}
          message={message}
          errorMessage={errorMessage} />}
    </div>
  )
}

export default App