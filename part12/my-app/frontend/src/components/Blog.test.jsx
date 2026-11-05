import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe, test, expect, vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is easy with Vitest',
    author: 'John Doe',
    url: 'https://testing.com',
    likes: 10,
    user: {
      username: 'johndoe',
      name: 'John Doe'
    }
  }
  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)

    const element = screen.getByText('Component testing is easy with Vitest John Doe')
    expect(element).toBeDefined()
    const urlElement = screen.queryByText('https://testing.com')
    const likesElement = screen.queryByText('likes 10')
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })
  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('https://testing.com')
    const likesElement = screen.getByText('likes 10')
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })
  test('if like button is clicked twice, event handler is called twice', async () => {
    const mockHandler = vi.fn() // Creamos un espía (mock) de Vitest
    render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={() => {}} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton) // Primero abrimos la tarjeta

    const likeButton = screen.getByText('like')
    await user.click(likeButton) // Primer clic
    await user.click(likeButton) // Segundo clic

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})