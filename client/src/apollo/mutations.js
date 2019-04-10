import { gql } from 'apollo-boost';

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

// const AvailabilityInput = gql`
// input AvailabilityInput {
//   weekdays: Boolean
//   weekends: Boolean
//   details: String
// }
// `

export const CREATE_VOLUNTEER_PROFILE = gql`
  mutation CreateVolunteerProfile(
    $bio: String!
    $availability: AvailabilityInput!
    $servicesProvided: [NeedType!]!
    $skills: [String!]
    $serviceLocation: LocationInput!
    $serviceRadius: Int!
  ) {
    createVolunteerProfile(
      bio: $bio
      availability: $availability
      servicesProvided: $servicesProvided
      skills: $skills
      serviceLocation: $serviceLocation
      serviceRadius: $serviceRadius
    ) {
      bio
      availability {
        weekdays
        weekends
        details
      }
      servicesProvided
      skills
      serviceLocation {
        address
        lat
        lng
      }
      serviceRadius
    }
  }
`

export const UPDATE_VOLUNTEER_PROFILE = gql`
  mutation UpdateVolunteerProfile(
    $bio: String
    $availability: AvailabilityInput
    $servicesProvided: [NeedType!]
    $skills: [String!]
    $serviceLocation: LocationInput
    $serviceRadius: Int
  ) {
    updateVolunteerProfile(
      bio: $bio
      availability: $availability
      servicesProvided: $servicesProvided
      skills: $skills
      serviceLocation: $serviceLocation
      serviceRadius: $serviceRadius
    ) {
      bio
      availability {
        weekdays
        weekends
        details
      }
      servicesProvided
      skills
      serviceLocation {
        address
        lat
        lng
      }
      serviceRadius
    }
  }
`

export const CREATE_NEED = gql`
  mutation CreateNeed(
    $title: String!
    $date: String!
    $needType: NeedType!
    $notes: String
    $location: LocationInput!
    $travelNeedDetails: TravelNeedInput
    $childcareNeedDetails: ChildcareNeedInput
  ) {
    createNeed(
      title: $title
      date: $date
      needType: $needType
      notes: $notes
      location: $location
      travelNeedDetails: $travelNeedDetails
      childcareNeedDetails: $childcareNeedDetails
    ) {
      id
    }
  }
`

export const CREATE_REQUEST = gql`
  mutation CreateRequest($need: ID!, $recipient: ID, $volunteer: ID!) {
    createRequest(need: $need, recipient: $recipient, volunteer: $volunteer) {
      id
      need {
        id
        title
      }
      recipient {
        id
        fullName
      }
      volunteer {
        id
        fullName
      }
      initiator
      status
    }
  }
`

export const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($requestId: ID!) {
    updateRequestStatus(id: $requestId, status: ACCEPTED) {
      id
      status
      need {
        id
        title
      }
    }
  }
`
