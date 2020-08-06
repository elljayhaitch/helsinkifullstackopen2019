const _ = require('lodash')

const totalLikes = (blogs) => {
  return _.sumBy(blogs, blog => blog.likes)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  var max = _.maxBy(blogs, blog => blog.likes)

  return {
    title: max.title,
    author: max.author,
    likes: max.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  var authors = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({ author: key, blogs: value.length }))
    .value()

  return _.maxBy(authors, author => author.blogs)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  var authors = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({ author: key, likes: _.sumBy(value, item => item.likes) }))
    .value()

  return _.maxBy(authors, author => author.likes)
}

module.exports = {
  totalLikes, favoriteBlog, mostBlogs, mostLikes
}