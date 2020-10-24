import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)

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
      {user === null ? <LoginForm setUser={setUser} /> : <BlogList setUser={setUser} />}
    </div>
  )
}

export default App