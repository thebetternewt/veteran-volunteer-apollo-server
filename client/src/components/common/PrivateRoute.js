import { Redirect } from '@reach/router/'
import jwt from 'jsonwebtoken'
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import { getUserToken } from '../../util/tokens'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const authContext = useContext(AuthContext)
  console.log('private route...')
  console.log('authContext:', authContext)
  console.log('private props:', rest)

  console.log('checking token...')
  const token = getUserToken()

  // If token doesn't exist, sign out user.
  if (!token) {
    return <Redirect to="/signout" noThrow />
  }

  // If token does exist, update authContext with user data.
  if (token && !authContext.user) {
    const user = jwt.decode(token)
    authContext.setAuthenticatedUser(user)
  }

  return <Component {...rest} />
}

export default PrivateRoute
