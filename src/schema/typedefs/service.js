import { gql } from 'apollo-server-express'

export default gql`
  union ServiceDetails = TravelService | LawncareService

  enum ServiceType {
    TRAVEL
    LAWNCARE
  }

  type Service {
    id: ID!
    title: String!
    serviceType: String!
    serviceDetails: ServiceDetails
    notes: String
    recipient: User!
    volunteer: User
    location: Location
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    service(id: ID!): Service
    services(
      serviceType: ServiceType
      location: LocationInput
      """
      Radius in miles
      """
      range: Int
    ): [Service!]!
  }

  input TestInput {
    testString: String
  }

  extend type Mutation {
    createService(
      serviceType: ServiceType!
      title: String!
      notes: String
      location: LocationInput!
      travelServiceDetails: TravelServiceInput
    ): Service
  }
`
