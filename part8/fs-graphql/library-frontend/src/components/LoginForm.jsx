import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage('login failed')
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line

  if (!show) return null

  const submit = (event) => {
    event.preventDefault()
    setErrorMessage(null)
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={submit}>
        <div>username <input aria-label="username" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
        <div>password <input aria-label="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm