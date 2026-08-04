import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

// 🔥 Función auxiliar mejorada para manejar la caché de Apollo
export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  // Actualizamos la consulta base (sin filtros de género)
  cache.updateQuery(query, (data) => {
    if (!data) return { allBooks: [addedBook] }
    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient() // 👈 1. ¡Instanciamos el cliente aquí!

  // Recuperar el token del localStorage al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem('phonenumbers-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  // 🔥 2. Escucha de Suscripciones en Tiempo Real
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`¡Nuevo libro añadido!: ${addedBook.title}`)
      
      // Actualizamos la caché de la consulta general
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore() // 🧹 Limpia la caché para evitar fugas de datos de usuario
    setPage('authors')
  }

  return (
    <div>
      {/* 🧭 Barra de Navegación Dinámica */}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {/* 🏛️ Renderizado de Vistas */}
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} />
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App