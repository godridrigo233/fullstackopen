import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
    color: '#15803d',
    borderRadius: 5
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification