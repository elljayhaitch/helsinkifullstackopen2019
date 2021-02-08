import React from 'react'
import Togglable from './Togglable'

const ReducedBlog = ({ blog }) => {
  return (
    <div>
      {blog.title} {blog.author} <Togglable buttonLabel='view' cancelLabel='hide'>
        <FullBlog blog={blog} />
      </Togglable>
    </div>)
}

const FullBlog = ({ blog }) => {
  return (
    <div>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button>like</button></div>
      <div>{blog.user.name}</div>
    </div>
  )
}

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle} >
      <ReducedBlog blog={blog} />
    </div>
  )
}

export default Blog