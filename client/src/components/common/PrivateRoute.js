import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/auth.context'

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const authContext = useContext(AuthContext)
  console.log('private route...')
  console.log('authContext:', authContext)
  // if (!getAuthenticatedUser() && location.pathname !== `/login`) {
  //   // If the user is not logged in, redirect to the login page.
  //   // try/catch necessary for static build
  //   try {
  //     // TODO: set friendly forward path in apollo cache
  //     // window.localStorage.setItem('friendlyForwardPath', location.pathname)
  //     navigate(`/login`)
  //   } catch (error) {
  //     // console.log('no window, skipping during build...')
  //   }
  //   return null
  // }

  return <Component {...rest} />
}

export default PrivateRoute
