import React, { useState } from 'react'
import blogService from '../services/blogs'
import userService from '../services/users'

const BlogForm = ({ loggedInUser, setNotification }) => {
  const emptyBlog = {
    title: '',
    author: '',
    url: ''
  }
  const [newBlog, setNewBlog] = useState(emptyBlog)

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const createBlog = async (event) => {
    event.preventDefault()

    userService.getAll()
      .then(users => {
        const user = users.find(user => user.username === loggedInUser.username)
        blogService.addBlog(newBlog.title, newBlog.author, newBlog.url, user.id)
          .then(blog => {
            setNotification(`A new blog ${blog.title} by ${blog.author} added`, false)
            setNewBlog(emptyBlog)
          })
          .catch(error => setNotification(`Could not add new blog, ${error}`, true))
      })
      .catch(error => setNotification(`Could not get user id in order to add new blog, ${error}`, true))
  }

  return (
    <div data-testid='blog-form'>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>title:<input data-testid='title-input' type="text" value={newBlog.title} name="title" onChange={handleChange} /></div>
        <div>author:<input type="text" value={newBlog.author} name="author" onChange={handleChange} /></div>
        <div>url:<input type="text" value={newBlog.url} name="url" onChange={handleChange} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm