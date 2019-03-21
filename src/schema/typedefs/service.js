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
    location: Location!
    recipient: User!
    request: Request!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    service(id: ID!): Service @auth
    services(
      serviceType: ServiceType
      location: LocationInput
      """
      Radius in miles
      """
      range: Int
    ): [Service!]! @auth
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
    ): Service @auth
    assignVolunteer(serviceId: ID!, volunteerId: ID!): Service @auth
  }

  input ServiceInput {
    serviceType: ServiceType!
    title: String!
    date: String!
    notes: String
    location: LocationInput!
    travelServiceDetails: TravelServiceInput
    childcareServiceDetails: ChildcareServiceInput
  }
`
