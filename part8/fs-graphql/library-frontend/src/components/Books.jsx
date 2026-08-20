import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading books...</div>
  }

  const books = result.data?.allBooks || []

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p>in genre <strong>{selectedGenre}</strong></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id || book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setSelectedGenre('refactoring')}>refactoring</button>
        <button onClick={() => setSelectedGenre('classic')}>classic</button>
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books