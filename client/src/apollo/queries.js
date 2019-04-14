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
  query NeedsQuery {
    needs {
      id
      title
      date
      location {
        lat
        lng
      }
      needType
      needDetails {
        ... on ChildcareNeed {
          age
        }
        # ... on LawncareService {
        #   description
        #   id
        #   equipmentNeeded
        # }
        # ... on TravelService {
        #   id
        #   fromName
        #   fromLocation {
        #     lat
        #     lng
        #   }
        #   toName
        #   toLocation {
        #     lat
        #     lng
        #   }
        # }
      }
    }
    recipient {
      id
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
          age
        }
        # ... on LawncareService {
        #   description
        #   id
        #   equipmentNeeded
        # }
        # ... on TravelService {
        #   id
        #   fromName
        #   fromLocation {
        #     lat
        #     lng
        #   }
        #   toName
        #   toLocation {
        #     lat
        #     lng
        #   }
        # }
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
