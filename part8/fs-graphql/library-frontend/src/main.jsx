import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importaciones de Apollo
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'

// 1. Definir el enlace
const httpLink = createHttpLink({
  uri: 'https://cautious-halibut-5j4g55rv694fv7pj-4000.app.github.dev/',
})

// 2. Crear el cliente
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
})

// 3. Envolver <App /> con ApolloProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)