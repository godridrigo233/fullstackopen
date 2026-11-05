const app = require('./app')
const config = require('./utils/config')
const { connectToDatabase } = require('./util/db')

const start = async () => {
  await connectToDatabase()
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start application', error)
    process.exit(1)
  })
}

module.exports = { start }