const _ = require('lodash')

// 4.3: Dummy
const dummy = (blogs) => {
  return 1
}

// 4.4: Total Likes
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5: Favorite Blog (el que tiene más likes)
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((max, blog) => 
    blog.likes > max.likes ? blog : max
  , blogs[0])

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// 4.6: Most Blogs (autor con mayor cantidad de blogs)
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  // Agrupa por autor y cuenta cuántos blogs tiene cada uno
  const authorCounts = _.countBy(blogs, 'author')
  
  // Convierte el objeto { "Autor": cantidad } a un arreglo y busca el máximo
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

// 4.7: Most Likes (autor con la suma total de likes más alta)
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  // 1. Agrupar los blogs por autor
  const blogsByAuthor = _.groupBy(blogs, 'author')

  // 2. Mapear cada autor a un objeto { author, likes: sumaDeLikes }
  const authorLikes = _.map(blogsByAuthor, (authorBlogs, authorName) => ({
    author: authorName,
    likes: _.sumBy(authorBlogs, 'likes')
  }))

  // 3. Obtener el objeto con mayor número de likes
  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}