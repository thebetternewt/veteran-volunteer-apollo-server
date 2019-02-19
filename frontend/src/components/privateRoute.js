import React from 'react'
import { navigate } from 'gatsby'
import { getAuthenticatedUser } from '../apollo/client'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!getAuthenticatedUser() && location.pathname !== `/login`) {
    // If the user is not logged in, redirect to the login page.
    // try/catch necessary for static build
    try {
      // TODO: set friendly forward path in apollo cache
      // window.localStorage.setItem('friendlyForwardPath', location.pathname)
      navigate(`/login`)
    } catch (error) {
      // console.log('no window, skipping during build...')
    }
    return null
  }

  return <Component {...rest} />
}

export default PrivateRoute
