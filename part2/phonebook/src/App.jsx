import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification' 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added, replace number?`)
      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        
        // Dentro de addPerson cuando llamas al servicio POST:
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessageType('success')
        setInfoMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setInfoMessage(null), 5000)
      })
      .catch(error => {
        setMessageType('error')
        setInfoMessage(error.response.data.error)
        setTimeout(() => setInfoMessage(null), 5000)
      })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }

    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setMessageType('success')
      setInfoMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => setInfoMessage(null), 5000)
    })
  }

  const deletePersonOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setMessageType('success')
        setInfoMessage(`Deleted ${name}`)
        setTimeout(() => setInfoMessage(null), 5000)
      })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Añadimos el componente en la vista */}
      <Notification message={infoMessage} type={messageType} />
      
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePersonOf} />
    </div>
  )
}

export default App