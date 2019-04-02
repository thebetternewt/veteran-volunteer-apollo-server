import React, { useState } from 'react'

export const AuthContext = React.createContext({
  userId: '',
  name: '',
  isAdmin: false,
})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
