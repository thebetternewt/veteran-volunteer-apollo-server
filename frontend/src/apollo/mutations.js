import { gql } from 'apollo-boost'

export const SIGNUP = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $age: Int!
    $email: String!
    $phone: String!
    $password: String!
    $street1: String!
    $street2: String
    $city: String!
    $state: String!
    $zipcode: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      age: $age
      email: $email
      phone: $phone
      password: $password
      address: {
        street1: $street1
        street2: $street2
        city: $city
        state: $state
        zipcode: $zipcode
      }
    ) {
      id
      firstName
      lastName
      age
      email
      phone
      age
      address {
        street1
        street2
        city
        state
        zipcode
      }
    }
  }
`
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export const CREATE_RECIPIENT_PROFILE = gql`
  mutation CreateRecipientProfile(
    $allowPhoneContact: Boolean
    $allowEmailContact: Boolean
    $lat: Float!
    $lng: Float!
  ) {
    createRecipientProfile(
      allowPhoneContact: $allowPhoneContact
      allowEmailContact: $allowEmailContact
      location: { lat: $lat, lng: $lng }
    ) {
      id
      allowPhoneContact
      allowEmailContact
      location {
        lat
        lng
      }
    }
  }
`
export const UPDATE_RECIPIENT_PROFILE = gql`
  mutation updateRecipientProfile(
    $allowPhoneContact: Boolean
    $allowEmailContact: Boolean
    $lat: Float
    $lng: Float
  ) {
    updateRecipientProfile(
      allowPhoneContact: $allowPhoneContact
      allowEmailContact: $allowEmailContact
      location: { lat: $lat, lng: $lng }
    ) {
      id
      allowPhoneContact
      allowEmailContact
      location {
        lat
        lng
      }
    }
  }
`
