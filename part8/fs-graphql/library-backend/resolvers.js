const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          query.author = author._id
        } else {
          return []
        }
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      // El .populate('author') reemplaza el ID por el objeto completo del autor
      return Book.find(query).populate('author')
    },
    
    allAuthors: async () => Author.find({}),
    
    me: (root, args, context) => context.currentUser
  },

  Author: {
    // Calculamos el número de libros escritos por cada autor
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Falló al guardar el nuevo autor', {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author, error }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Falló al guardar el libro', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title, error }
        })
      }

      return book.populate('author')
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('No autenticado', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Falló al actualizar al autor', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error }
        })
      }
      return author
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save().catch(error => {
        throw new GraphQLError('Error al crear usuario', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.username, error }
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      // Según el ejercicio 8.16, la contraseña hardcodeada para todos es "secret"
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Credenciales incorrectas', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },

    // Ejercicio 8.17: Limpiar la base de datos antes de las pruebas automáticas
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase solo está disponible en modo test')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    }
  }
}

module.exports = resolvers