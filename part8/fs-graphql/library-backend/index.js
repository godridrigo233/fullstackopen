const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/User')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Conectado a MongoDB'))

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  // Configuración del servidor WebSocket
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  // Configuración del servidor Apollo
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`🚀 Servidor HTTP y WebSocket listos en http://localhost:${PORT}`)
  )
}

start()