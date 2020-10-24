import React, { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = (props) => {
  const { setUser } = props

  const [blogs, setBlogs] = useState([])

  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = JSON.parse(loggedUserJSON)
  const name = user.name

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{name} logged in<button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>)
}

export default BlogList
