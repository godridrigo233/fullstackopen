import React from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  // Estilo base para las notificaciones
  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: type === 'error' ? 'red' : 'green',
    borderColor: type === 'error' ? 'red' : 'green'
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification