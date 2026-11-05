const Todo = ({ todo, deleteTodo, completeTodo }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
    <span>{todo.text}</span>
    <span>
      {todo.done ? 'This todo is done' : 'This todo is not done'}
      <button onClick={() => deleteTodo(todo)}>Delete</button>
      {!todo.done && <button onClick={() => completeTodo(todo)}>Set as done</button>}
    </span>
  </div>
)

export default Todo