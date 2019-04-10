import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'
import jwtDecode from 'jwt-decode'
import graphQlErrors from '../util/graphqlErrors'
import { AUTH_QUERY } from './queries'

const defaultState = {
  user: null,
  token: null,
  redirectPath: null,
}

export const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  credentials: 'include',
  fetch,
  clientState: {
    defaults: defaultState,
  },
  request: operation => {
    console.log('operation:', operation)
  },
  onError: ({ graphQLErrors, networkError, response }) => {
    if (graphQlErrors) {
      console.log('ApolloClient graphQLErrors')
      console.log(graphQLErrors)

      const notAuthenticated = graphQLErrors.find(err => {
        return err.message === 'You must be signed in.'
      })

      if (notAuthenticated) {
        console.log('NOT AUTHENTICATED!')
        window.location.pathname !== '/signin' &&
          window.location.replace('/signin')
      }
    }

    if (networkError) {
      console.log('ApolloClient networkError')
      console.log(networkError)
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
