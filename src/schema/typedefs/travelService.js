import { gql } from 'apollo-server-express'

export default gql`
  type TravelService {
    id: ID!
    fromName: String!
    fromLocation: [Float]
    toName: String!
    toLocation: [Float]
    createdAt: String!
    updatedAt: String!
  }

  # extend type Query {
  # travelService(id: ID!): TravelService
  # travelServices(point: [Float!]): [TravelService!]!
  # }

  extend type Mutation {
    createTravelService(
      fromName: String!
      fromLocation: [Float!]!
      toName: String!
      toLocation: [Float!]!
      serviceId: String!
    ): TravelService
  }
`
