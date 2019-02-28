import { gql } from 'apollo-server-express'

export default gql`
  union ServiceDetails = TravelService | LawncareService | ChildcareService

  enum ServiceType {
    TRAVEL
    LAWNCARE
    CHILDCARE
    HOME_MAINTENANCE
  }

  type Service {
    id: ID!
    title: String!
    date: String!
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
      date: String!
      notes: String
      location: LocationInput!
      travelServiceDetails: TravelServiceInput
      childcareServiceDetails: ChildcareServiceInput
    ): Service
    assignVolunteer(serviceId: ID!, volunteerId: ID!): Service
  }
`
