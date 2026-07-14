import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import reducer from './reducer'
const store = createStore(reducer)

const App = () => {
  const state = store.getState()

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '20px' }}>
      <h2>Unicafe Redux</h2>
      
      {/* Con store.dispatch(...) enviamos un formulario/acción al reducer */}
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>reset stats</button>

      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <div>good {state.good}</div>
        <div>ok {state.ok}</div>
        <div>bad {state.bad}</div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => {
  root.render(<App />)
}
renderApp()
store.subscribe(renderApp)