import { gql } from 'apollo-server-express'

export default gql`
  type Location {
    lat: Float!
    lng: Float!
  }

  type TravelService {
    id: ID!
    fromName: String!
    fromLocation: Location!
    toName: String!
    toLocation: Location!
    createdAt: String!
    updatedAt: String!
  }

  # extend type Query {
  # travelService(id: ID!): TravelService
  # travelServices(point: [Float!]): [TravelService!]!
  # }

  input LocationInput {
    lat: Float
    lng: Float
  }

  extend type Mutation {
    createTravelService(
      fromName: String!
      fromLocation: LocationInput!
      toName: String!
      toLocation: LocationInput!
      serviceId: String!
    ): TravelService
  }
`
