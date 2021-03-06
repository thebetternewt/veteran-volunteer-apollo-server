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

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      fullName
      email
      active
      admin
      recipientProfile {
        id
      }
      volunteerProfile {
        id
      }
    }
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      fullName
      avatar
      admin
      recipientProfile {
        id
        allowPhoneContact
        allowEmailContact
        location {
          address
          lat
          lng
        }
      }
      volunteerProfile {
        id
        bio
        availability {
          weekends
          weekdays
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
      requestedNeeds {
        id
        title
        date
        needType
      }
    }
  }
`
export const NEEDS_QUERY = gql`
  query NeedsQuery($currentUser: Boolean) {
    needs(currentUser: $currentUser) {
      id
      title
      date
      location {
        address
        lat
        lng
      }
      recipient {
        id
        fullName
        avatar
      }
      needType
      needDetails {
        ... on ChildcareNeed {
          id
          age
          description
        }
        ... on LawncareNeed {
          id
          equipmentNeeded
          description
        }
        ... on HomeMaintenanceNeed {
          id
          equipmentSupplied
          partsSupplied
          maintenanceType
          description
        }
        ... on OtherNeed {
          id
          description
        }
      }
      requests {
        id
        status
        recipient {
          id
          fullName
          avatar
        }
        volunteer {
          id
          fullName
          avatar
        }
      }
    }
  }
`

export const NEED_QUERY = gql`
  query NeedQuery($id: ID!) {
    need(id: $id) {
      id
      title
      date
      location {
        address
        lat
        lng
      }
      needType
      needDetails {
        ... on ChildcareNeed {
          id
          age
          description
        }
        ... on LawncareNeed {
          id
          equipmentNeeded
          description
        }
        ... on HomeMaintenanceNeed {
          id
          equipmentSupplied
          partsSupplied
          maintenanceType
          description
        }
        ... on OtherNeed {
          id
          description
        }
      }
    }
  }
`

export const VOLUNTEER_PROFILES_FOR_NEED_QUERY = gql`
  query VolunteerProfilesForNeed(
    $needType: NeedType
    $location: LocationInput
  ) {
    volunteerProfilesForNeed(needType: $needType, location: $location) {
      id
      bio
      availability {
        weekdays
        weekends
        details
      }
      user {
        id
        avatar
        firstName
        fullName
      }
      servicesProvided
    }
  }
`

export const REQUESTS_QUERY = gql`
  query Requests($userId: ID, $status: RequestStatus) {
    requests(userId: $userId, status: $status) {
      id
      status
      need {
        id
        title
        needType
        date
        notes
      }
      recipient {
        id
        fullName
        avatar
      }
      volunteer {
        id
        fullName
        avatar
      }
    }
  }
`
