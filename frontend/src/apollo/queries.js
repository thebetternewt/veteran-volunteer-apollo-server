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
        location {
          lat
          lng
        }
      }
      requestedServices {
        id
        title
        serviceType
      }
    }
  }
`
const SERVICES_QUERY = gql`
  query ServicesQuery {
    services {
      id
      title
      location {
        lat
        lng
      }
      serviceType
      serviceDetails {
        ... on LawncareService {
          description
          id
          equipmentNeeded
        }
        ... on TravelService {
          id
          fromName
          fromLocation {
            lat
            lng
          }
          toName
          toLocation {
            lat
            lng
          }
        }
      }
    }
    recipient {
      id
    }
  }
`
