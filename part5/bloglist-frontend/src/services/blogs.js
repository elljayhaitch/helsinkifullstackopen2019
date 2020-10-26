import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.get(baseUrl, config)
  return request
    .then(response => response.data)
}

const addBlog = (title, author, url, userId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
  }

  const data = {
    title,
    author,
    url,
    likes: 0,
    userId
  }

  const request = axios.post(baseUrl, data, config)
  return request
    .then(response => response.data)
}

export default { getAll, setToken, addBlog }