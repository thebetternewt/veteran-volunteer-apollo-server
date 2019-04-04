import { gql } from 'apollo-server-express'

export default gql`
  type Availability {
    weekdays: Boolean!
    weekends: Boolean!
    details: String
  }

  input AvailabilityInput {
    weekdays: Boolean
    weekends: Boolean
    details: String
  }

  type VolunteerProfile {
    id: ID!
    user: User!
    bio: String!
    availability: Availability!
    servicesProvided: [NeedType!]!
    skills: [String!]!
    serviceLocation: Location!
    serviceRadius: Int!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    VolunteerProfile(id: ID!): VolunteerProfile
    VolunteerProfiles: [VolunteerProfile!]!
  }

  extend type Mutation {
    createVolunteerProfile(
      bio: String!
      availability: AvailabilityInput!
      servicesProvided: [NeedType!]!
      skills: [String!]
      serviceLocation: LocationInput!
      serviceRadius: Int!
    ): VolunteerProfile
    updateVolunteerProfile(
      bio: String
      availability: AvailabilityInput
      servicesProvided: [NeedType!]
      skills: [String!]
      serviceLocation: LocationInput
      serviceRadius: Int
    ): VolunteerProfile
  }
`
