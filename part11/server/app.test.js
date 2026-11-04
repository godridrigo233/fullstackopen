import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createApp } from './app.js'

let server
let baseUrl

before(async () => {
  server = createApp([{ id: '1', name: 'Ada Lovelace', number: '040-123456' }])
    .listen(0)
  await new Promise(resolve => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => new Promise((resolve, reject) => {
  server.close(error => error ? reject(error) : resolve())
}))

test('health endpoint reports that the service is ready', async () => {
  const response = await fetch(`${baseUrl}/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('version endpoint reports the application version', async () => {
  const response = await fetch(`${baseUrl}/api/version`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { version: '1.0.0' })
})

test('contacts can be created, updated, listed, and deleted over HTTP', async () => {
  const createdResponse = await fetch(`${baseUrl}/api/persons`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: '  Grace Hopper ', number: ' 040-987654 ' }),
  })
  assert.equal(createdResponse.status, 201)
  const created = await createdResponse.json()
  assert.deepEqual(created, { id: '2', name: 'Grace Hopper', number: '040-987654' })

  const updateResponse = await fetch(`${baseUrl}/api/persons/${created.id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Grace Hopper', number: '050-111111' }),
  })
  assert.equal(updateResponse.status, 200)
  assert.equal((await updateResponse.json()).number, '050-111111')

  const listResponse = await fetch(`${baseUrl}/api/persons`)
  assert.equal((await listResponse.json()).length, 2)

  const deleteResponse = await fetch(`${baseUrl}/api/persons/${created.id}`, {
    method: 'DELETE',
  })
  assert.equal(deleteResponse.status, 204)
})

test('invalid contacts and unknown IDs return useful errors', async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/persons`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Ada' }),
  })
  assert.equal(invalidResponse.status, 400)
  assert.deepEqual(await invalidResponse.json(), { error: 'name and number are required' })

  const missingResponse = await fetch(`${baseUrl}/api/persons/missing`, {
    method: 'DELETE',
  })
  assert.equal(missingResponse.status, 404)
})
