import { navigate } from '@reach/router/lib/history'
import jwtDecode from 'jwt-decode'
import config from '../apollo/config/config'

const checkToken = () => {
  const token = localStorage.getItem(config.userTokenName)

  if (token) {
    // AuthContext.setAuthenticatedUser(token)
    const decoded = jwtDecode(token)
    // Set user data in Apollo cache
  } else {
    console.log('NO TOKEN!')
    navigate('/signout')
  }
}

export const setUserToken = token =>
  localStorage.setItem(config.userTokenName, token)

export const clearUserToken = () =>
  localStorage.removeItem(config.userTokenName)

export default checkToken
