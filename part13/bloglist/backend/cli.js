const { QueryTypes } = require('sequelize')
const { sequelize } = require('./util/db')

const printBlogs = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query(
      'SELECT author, title, likes FROM blogs ORDER BY id',
      { type: QueryTypes.SELECT },
    )
    for (const blog of blogs) {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    }
  } finally {
    await sequelize.close()
  }
}

printBlogs().catch((error) => {
  console.error(error)
  process.exitCode = 1
})