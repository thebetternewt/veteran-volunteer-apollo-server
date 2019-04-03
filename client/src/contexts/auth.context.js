import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

export const AuthContext = React.createContext({
  userId: '',
  name: '',
  isAdmin: false,
})

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['sid'])
  const [user, setUser] = useState()

  console.log(cookies)

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
