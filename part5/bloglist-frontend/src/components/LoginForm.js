import React from 'react'
import Notification from './Notification'
import PropTypes from 'prop-types'

const LoginForm = (props) => {
  const { handleSubmit, message, errorMessage,
    username, password, handleUsernameChange, handlePasswordChange } = props

  return (
    < div >
      <h2>log in to application</h2>

      <Notification message={message} notificationClass="notification" />
      <Notification message={errorMessage} notificationClass="error" />

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div >
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm