import { gql } from 'apollo-boost'

export const AUTH_QUERY = gql`
  query AuthQuery {
    user @client {
      firstName
      lastName
      fullName
      email
      avatar
    }
  }
`

export const TOKEN_QUERY = gql`
  query TokenQuery {
    token @client
  }
`

export const REDIRECT_QUERY = gql`
  query RedirectQuery {
    redirectPath @client
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      id
      fullName
      avatar
      recipientProfile {
        id
        allowPhoneContact
        allowEmailContact
        location
      }
    }
  }
`
