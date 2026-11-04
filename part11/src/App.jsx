import { useEffect, useState } from 'react'

const api = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const notify = (text, isError = false) => {
    setMessage(text)
    setError(isError)
    window.setTimeout(() => setMessage(''), 4000)
  }

  useEffect(() => {
    fetch(api)
      .then(response => {
        if (!response.ok) throw new Error('Could not load contacts')
        return response.json()
      })
      .then(setPersons)
      .catch(() => notify('Could not load contacts. Is the server running?', true))
  }, [])

  const submit = async event => {
    event.preventDefault()
    const existing = persons.find(person => person.name.toLowerCase() === name.trim().toLowerCase())
    const method = existing ? 'PUT' : 'POST'
    const url = existing ? `${api}/${existing.id}` : api

    if (existing && !window.confirm(`${existing.name} already exists. Replace the number?`)) {
      return
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, number }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save contact')

      setPersons(existing
        ? persons.map(person => person.id === result.id ? result : person)
        : persons.concat(result))
      setName('')
      setNumber('')
      notify(`${existing ? 'Updated' : 'Added'} ${result.name}`)
    } catch (requestError) {
      notify(requestError.message, true)
    }
  }

  const remove = async person => {
    if (!window.confirm(`Delete ${person.name}?`)) return

    try {
      const response = await fetch(`${api}/${person.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete contact')
      setPersons(persons.filter(item => item.id !== person.id))
      notify(`Deleted ${person.name}`)
    } catch (requestError) {
      notify(requestError.message, true)
    }
  }

  const visiblePersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">FULL STACK OPEN · PART 11</p>
        <h1>Phonebook</h1>
        <p>A small app built to practice continuous integration and delivery.</p>
      </header>

      {message && <div className={`notice ${error ? 'error' : ''}`} role="status">{message}</div>}

      <section className="panel" aria-labelledby="contacts-title">
        <h2 id="contacts-title">Contacts</h2>
        <label className="field">
          <span>Filter contacts</span>
          <input value={filter} onChange={event => setFilter(event.target.value)} />
        </label>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span>Name</span>
            <input required value={name} onChange={event => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Phone number</span>
            <input required value={number} onChange={event => setNumber(event.target.value)} />
          </label>
          <button className="primary" type="submit">Add contact</button>
        </form>

        <ul className="contacts">
          {visiblePersons.map(person => (
            <li key={person.id}>
              <div>
                <strong>{person.name}</strong>
                <span>{person.number}</span>
              </div>
              <button className="remove" type="button" onClick={() => remove(person)}>
                Delete
              </button>
            </li>
          ))}
          {visiblePersons.length === 0 && <li className="empty">No contacts found.</li>}
        </ul>
      </section>
    </main>
  )
}

export default App
