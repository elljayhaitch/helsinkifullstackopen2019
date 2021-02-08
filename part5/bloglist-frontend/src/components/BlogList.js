import React, { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'
import Notification from './Notification'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

const BlogList = (props) => {
  const { setUser, setNotification, message, errorMessage } = props

  const [blogs, setBlogs] = useState([])

  const loggedInUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  const loggedInUser = JSON.parse(loggedInUserJSON)
  const name = loggedInUser.name

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
      .catch(error => setNotification(`Could not get all blogs, ${error}`, true))
  }, [setNotification])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} notificationClass="notification" />
      <Notification message={errorMessage} notificationClass="error" />

      <p>{name} logged in<button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel='new blog'>
        <BlogForm
          loggedInUser={loggedInUser}
          setNotification={setNotification}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>)
}

export default BlogList
