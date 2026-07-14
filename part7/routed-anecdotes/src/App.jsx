import { useField } from './hooks'
import { useNavigate } from 'react-router-dom'

const CreateNew = (props) => {
  // Instanciamos nuestro custom hook para cada campo (7.1)
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/') // Redirige al inicio (7.3)
  }

  // Función para el botón reset (7.2)
  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  // 🔥 SOLUCIÓN EJERCICIO 7.3: 
  // Extraemos 'reset' en una variable y guardamos el resto en '...contentInput'
  const { reset: resetContent, ...contentInput } = content
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetInfo, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          {/* Ahora pasamos solo las propiedades válidas al input */}
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}