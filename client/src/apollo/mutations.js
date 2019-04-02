import { gql } from 'apollo-boost'

export const SIGNUP = gql`
  mutation SignUp(
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
    signUp(
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
export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
    }
  }
`

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`

export const CREATE_RECIPIENT_PROFILE = gql`
  mutation CreateRecipientProfile(
    $allowPhoneContact: Boolean
    $allowEmailContact: Boolean
    $location: LocationInput
  ) {
    createRecipientProfile(
      allowPhoneContact: $allowPhoneContact
      allowEmailContact: $allowEmailContact
      location: $location
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
    $location: LocationInput
  ) {
    updateRecipientProfile(
      allowPhoneContact: $allowPhoneContact
      allowEmailContact: $allowEmailContact
      location: $location
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

export const CREATE_SERVICE = gql`
  mutation createService(
    $title: String!
    $date: String!
    $serviceType: ServiceType!
    $notes: String
    $location: LocationInput!
    $travelServiceDetails: TravelServiceInput
    $childcareServiceDetails: ChildcareServiceInput
  ) {
    createService(
      title: $title
      date: $date
      serviceType: $serviceType
      notes: $notes
      location: $location
      travelServiceDetails: $travelServiceDetails
      childcareServiceDetails: $childcareServiceDetails
    ) {
      id
    }
  }
`

export const CREATE_REQUEST = gql`
  mutation CreateRequest(
    $service: ServiceInput!
    $recipient: ID
    $volunteer: ID
  ) {
    createRequest(
      service: $service
      recipient: $recipient
      volunteer: $volunteer
    ) {
      id
    }
  }
`
