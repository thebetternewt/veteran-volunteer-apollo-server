import React from 'react';
const PrivateRoute = ({ component: Component, location, ...rest }) => {
  console.log('private route...')
  // console.log('authContext:', authContext)
  // console.log('private props:', rest)

  // console.log('checking token...')
  // const token = getUserToken()

  // If token doesn't exist, sign out user.
  // if (!token) {
  //   return <Redirect to="/signout" noThrow />
  // }

  // If token does exist, update authContext with user data.
  // if (token && !authContext.user) {
  //   const user = jwt.decode(token)
  //   authContext.setAuthenticatedUser(user)
  // }

  return <Component {...rest} />
}

export default PrivateRoute
