import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import packageInfo from '../package.json' with { type: 'json' }

const here = path.dirname(fileURLToPath(import.meta.url))

export const createApp = (initialPersons = []) => {
  const app = express()
  let persons = initialPersons.map(person => ({ ...person }))
  let nextId = persons.reduce((largest, person) => Math.max(largest, Number(person.id) || 0), 0) + 1

  app.use(express.json())

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.get('/api/version', (_request, response) => {
    response.json({ version: packageInfo.version })
  })

  app.get('/api/persons', (_request, response) => {
    response.json(persons)
  })

  app.post('/api/persons', (request, response) => {
    const name = typeof request.body.name === 'string' ? request.body.name.trim() : ''
    const number = typeof request.body.number === 'string' ? request.body.number.trim() : ''

    if (!name || !number) {
      return response.status(400).json({ error: 'name and number are required' })
    }

    const person = { id: String(nextId++), name, number }
    persons = persons.concat(person)
    response.status(201).json(person)
  })

  app.put('/api/persons/:id', (request, response) => {
    const name = typeof request.body.name === 'string' ? request.body.name.trim() : ''
    const number = typeof request.body.number === 'string' ? request.body.number.trim() : ''
    const existing = persons.find(person => person.id === request.params.id)

    if (!existing) {
      return response.status(404).json({ error: 'person not found' })
    }
    if (!name || !number) {
      return response.status(400).json({ error: 'name and number are required' })
    }

    const updated = { ...existing, name, number }
    persons = persons.map(person => person.id === updated.id ? updated : person)
    response.json(updated)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const remaining = persons.filter(person => person.id !== request.params.id)

    if (remaining.length === persons.length) {
      return response.status(404).json({ error: 'person not found' })
    }

    persons = remaining
    response.status(204).end()
  })

  app.use(express.static(path.resolve(here, '../dist')))

  return app
}
