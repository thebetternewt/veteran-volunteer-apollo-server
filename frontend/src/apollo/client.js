import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'
import jwtDecode from 'jwt-decode'
import { AUTH_QUERY } from './queries'

const defaultState = {
  user: null,
  token: null,
  redirectPath: null,
}

export const client = new ApolloClient({
  uri: `${process.env.GATSBY_SERVER_URL}/graphql`,
  fetch,
  clientState: {
    defaults: defaultState,
  },
  request: operation => {
    const token = localStorage.getItem('token')
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    }
  },
})

export const setAuthenticatedUser = token => {
  const userData = jwtDecode(token)
  client.cache.writeData({
    data: {
      user: { __typename: 'user', ...userData },
      token: { __typename: 'token', token },
    },
  })
}

export const getAuthenticatedUser = () => {
  const data = client.readQuery({
    query: AUTH_QUERY,
  })

  if (data) {
    return data.user
  }

  return null
}

export const logOutUser = async () => {
  localStorage.removeItem('token')
  client.clearStore()
}
