import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import './App.css'

const App = () => {
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      {user === null ?
        <LoginForm setUser={setUser} setNotification={setNotification} message={message} errorMessage={errorMessage} /> :
        <BlogList setUser={setUser} setNotification={setNotification} message={message} errorMessage={errorMessage} />}
    </div>
  )
}

export default App