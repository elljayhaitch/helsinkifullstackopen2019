const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  var max = Math.max(...blogs.map(item => item.likes));
  var firstMax = blogs.find(item => item.likes === max);

  return {
    title: firstMax.title,
    author: firstMax.author,
    likes: firstMax.likes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}