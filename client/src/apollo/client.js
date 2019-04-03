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
  // uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  uri: `http://localhost:5000/graphql`,
  credentials: 'include',
  fetch,
  clientState: {
    defaults: defaultState,
  },
  request: operation => {
    console.log('operation:', operation)
    const token = localStorage.getItem('token')
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    }
  },
  onError: error => {
    if (error.graphQLErrors) {
      console.log('ApolloClient graphQLErrors')
      console.log(error.graphQLErrors)
    }
    if (error.networkError) {
      console.log('ApolloClient networkError')
      console.log(error.networkError)
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
