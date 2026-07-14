import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id || blog.user : null
    }
    updateBlog(blog.id, updatedBlog)
  }
  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }
  const showRemoveButton = blog.user && user && (
    blog.user.username === user.username || blog.user === user.id
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : ''}</p>
          
          {showRemoveButton && (
            <button 
              onClick={handleRemove} 
              style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default Blog