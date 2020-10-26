import React, { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'
import userService from '../services/users'
import Notification from './Notification'

const BlogList = (props) => {
  const { setUser, setNotification, message, errorMessage } = props

  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const loggedInUserJSON = window.localStorage.getItem('loggedBlogappUser')
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
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (event) => {
    event.preventDefault()

    userService.getAll()
      .then(users => {
        const user = users.find(user => user.username === loggedInUser.username)
        blogService.addBlog(title, author, url, user.id)
          .then(blog =>
            setNotification(`A new blog ${blog.title} by ${blog.author} added`, false)
          )
          .catch(error => setNotification(`Could not add new blog, ${error}`, true))
      })
      .catch(error => setNotification(`Could not get user id in order to add new blog, ${error}`, true))
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} notificationClass="notification" />
      <Notification message={errorMessage} notificationClass="error" />

      <p>{name} logged in<button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>title:<input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author:<input type="text" value={author} name="author" onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url:<input type="text" value={url} name="url" onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>)
}

export default BlogList
