import React from 'react'
import Notification from './Notification'

const LoginForm = (props) => {
  const { handleSubmit, message, errorMessage,
    username, password, setUsername, setPassword } = props

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
            onChange={setUsername}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={setPassword}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div >
  )
}

export default LoginForm