import React, { useContext, useState } from 'react'

export const AuthContext = React.createContext({
  user: null,
  setAuthenticatedUser: user => {},
})

const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext)
  const [user, setUser] = useState(authContext.user)

  // const setAuthenticatedUser = user => {
  //   authContext.user = user
  // }

  return (
    <AuthContext.Provider
      value={{ user, setAuthenticatedUser: user => setUser(user) }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
