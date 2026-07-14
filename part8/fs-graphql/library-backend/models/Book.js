const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author' // 👈 Conexión clave con el modelo de Autor
  },
  genres: [
    { type: String }
  ]
})

module.exports = mongoose.model('Book', schema)