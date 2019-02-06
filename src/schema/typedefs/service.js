import { gql } from 'apollo-server-express'

export default gql`
  type Service {
    id: ID!
    title: String!
    serviceType: String!
    travelServiceDetails: TravelService
    notes: String
    recipient: User!
    volunteer: User
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    service(id: ID!): Service
    services(serviceType: String, startPoint: [Float!], range: Int): [Service!]!
  }

  extend type Mutation {
    createService(
      title: String!
      serviceType: String!
      serviceDetailsId: String!
      notes: String
    ): Service
  }
`
