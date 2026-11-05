import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { test, expect, vi } from 'vitest'

test('<BlogForm /> calls onSubmit with correct details when creating a blog', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)
  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'Testing title Vitest')
  await user.type(inputs[1], 'Autor de prueba')
  await user.type(inputs[2], 'https://vitest.dev')
  await user.click(sendButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing title Vitest',
    author: 'Autor de prueba',
    url: 'https://vitest.dev'
  })
})