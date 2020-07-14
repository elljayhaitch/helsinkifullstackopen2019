const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Nuts',
    author: "Chris O’Leary",
    url: 'https://bowiesongs.wordpress.com/2020/06/29/nuts/',
    likes: 0
  },
  {
    title: "Stephen Graham Jones's Playlist for His Novel 'The Only Good Indians'",
    author: 'Largehearted Boy',
    url: 'http://www.largeheartedboy.com/blog/archive/2020/07/stephen_graham.html',
    likes: 0
  },
]

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 0
    }
  )
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}