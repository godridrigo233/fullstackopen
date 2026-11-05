import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Todo from './Todo'

afterEach(cleanup)

describe('Todo', () => {
  it('renders a pending todo and invokes its actions', () => {
    const todo = { _id: '1', text: 'Learn Docker', done: false }
    const deleteTodo = vi.fn()
    const completeTodo = vi.fn()

    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />)

    expect(screen.getByText('Learn Docker')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Set as done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(completeTodo).toHaveBeenCalledWith(todo)
    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })

  it('does not offer completion for a finished todo', () => {
    render(<Todo todo={{ text: 'Done', done: true }} deleteTodo={() => {}} completeTodo={() => {}} />)

    expect(screen.queryByRole('button', { name: 'Set as done' })).toBeNull()
    expect(screen.getByText('This todo is done')).toBeTruthy()
  })
})